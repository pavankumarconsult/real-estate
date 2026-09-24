# Team4 Aria — Medha Ventures

A responsive React and TypeScript real-estate presentation site branded as Medha Ventures for the Team4 Aria property. Medha Ventures is not identified as the property developer, and Digystate is credited only as the digital marketing agency in the footer.

## Local development

```bash
npm install
npm run dev
```

## Content sources

- Display brand, phone, email, WhatsApp message, and Google Maps URL: `src/config/site.ts`
- Approved project facts, FAQ copy, image imports, and optional section data: `src/data/projects.ts`
- Shared enquiry flow: `src/components/EnquiryModal.tsx` and `src/services/enquiryService.ts`

The main visitor action is **Call Now**. The shared enquiry form validates the visitor's entries and opens WhatsApp with a prefilled draft; the visitor must press Send in WhatsApp. The site has no enquiry backend and does not store visitor contact details in local storage.

## Optional sections

Floor plans, amenities, specifications, developer information, and brochure actions remain hidden while their approved content or assets are unavailable. Their data-backed components can be enabled after approved values are added.

## Asset approval

The images under `src/assets/images/` were already present in the workspace. Their usage rights and final client approval have not been confirmed. Current captions identify them as project visuals pending usage approval, and the import paths are centralized in `src/data/projects.ts` for straightforward replacement.
