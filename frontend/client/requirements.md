## Packages
react-markdown | For rendering rich text in assistant responses
clsx | For conditional class merging
tailwind-merge | For safe class merging

## Notes
Tailwind Config - extend fontFamily:
fontFamily: {
  display: ["var(--font-display)"],
  body: ["var(--font-body)"],
  mono: ["var(--font-mono)"],
}
API requires POST /api/query for chat
API requires GET /api/nearby-hospitals for maps
