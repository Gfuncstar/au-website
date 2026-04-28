# Kartra email-editor "Save won't wake" — the workaround

## The problem

When you call `Replace Template` in Kartra's email-builder editor (sequence emails or
broadcasts), the new template renders correctly in the canvas — but the **Save** /
**Save & Exit** buttons in the `Actions` dropdown stay disabled. Their `disabled`
attribute is set to `true`. The visible state never flips to "dirty".

Trying to wake the dirty flag by clicking into a text component, typing a real
character, or modifying the subject line **does not work** when the editor is
driven by Claude-in-Chrome (or any non-trusted-input automation). The CKEditor
instance and the Vue component holding the dirty flag don't recognise programmatic
keystrokes as a real edit.

This is what bit Bernadette on 25 April: from the human side, Save would have
been live, but Replace Template wiped some emails because the template-swap markup
collision wiped body content. From the automation side, the opposite problem —
Save is disabled, so changes can't persist at all.

## The workaround

The save button is wired via a jQuery **delegated** click handler on `document`,
not via a direct click handler on the button itself. Calling
`element.click()` on the disabled button does nothing because the browser blocks
clicks on disabled elements before the delegated handler runs.

But jQuery's `.trigger('click')` runs the delegated handler regardless of the
button's disabled state. So:

```javascript
const $btn = jQuery('.js_save_composer').first();
$btn.prop('disabled', false);     // remove the disabled attr (cosmetic)
$btn.removeClass('disabled');      // remove disabled class (cosmetic)
$btn.trigger('click');             // fires the delegated jQuery handler
```

That POSTs the current email content to:

```
POST https://app.kartra.com/api-internal/communications/{email_id}
```

with a ~25-30KB form body containing the full email JSON (subject, body HTML,
template id, etc.). The save persists. Reloading the sequence shows the new
template applied to Version B, traffic untouched on Version A.

## The full apply-and-persist sequence

For each email you want to migrate to a new AU template:

1. Navigate to the sequence: `https://app.kartra.com/marketing/sequences/edit/{sequence_id}`.
2. Click the 3-dot menu on the email card → **Edit email content**.
3. If no Version B exists yet, click **+ New version**.
4. Click the **Version B** tab.
5. Click **Edit message**.
6. Click **Replace template** (top-left blue button in the editor).
7. Click the **My templates** tab in the picker.
8. Find the target template by name (e.g. `RAG PP 1`) and click its thumbnail.
9. Click **Done**.
10. Confirm by clicking **Replace** in the "All progress, copy, images and
    changes will be lost" dialog. (Safe — the template you're applying already
    has the body content baked in.)
11. **Fire the save trick:**
    ```javascript
    const $btn = jQuery('.js_save_composer').first();
    $btn.prop('disabled', false);
    $btn.removeClass('disabled');
    $btn.trigger('click');
    ```
12. Wait ~3 seconds for the POST to complete.
13. (Optional) Set Version B traffic to 100% if you want recipients to receive
    the new version. Otherwise leave at 0% — Version A stays live, Version B
    is reviewable as a draft.

## Why this is needed

If you're applying templates from "My Templates" that already contain the
correct subject + body + CTA URL (i.e. each template is a per-email
customised file, not a generic shell), then the only step left after Replace
Template is the persistence step. Without it, the apply doesn't survive
navigation.

Bernadette can do this manually by clicking into a text component and typing a
real character (which the human input layer accepts as dirty). The trick above
is for cases where you're driving the editor programmatically.

## Caveats

- The `.js_save_composer` jQuery handler relies on Kartra's current jQuery setup.
  If Kartra changes their bundle, this trick may stop working.
- The save fires regardless of whether the canvas state matches what you want
  saved. Always **verify the canvas** (read the DOM) before triggering save.
- Don't fire on Version A unless you mean to — recipients receive Version A.
- Auto-save (`emailDraftPreventAutosave: false`) handles local draft persistence
  but does not write to the server. Server-side persistence requires this trick.

## Captured network when save fires

```
POST /api-internal/communications/{email_id}
Body length: ~26000 bytes (form-encoded JSON-ish)
Status: 200 (when successful)
```

The `{email_id}` is the email's internal Kartra id, not the sequence id.
Discoverable via the GET on the same path that loads the email when you open
the editor.

— captured during the AU template migration session, 28 April 2026.
