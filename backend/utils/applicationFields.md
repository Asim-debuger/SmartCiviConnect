Normalizers for profile and application form fields.

- `toSkillList(value)` - Converts a skill value to an array of trimmed skill strings; accepts comma-separated strings, arrays of strings, or arrays of objects with `name`/`skill`.
- `asStoredProfileField(bodyValue, profileValue)` - Returns the submitted form value if present, otherwise falls back to the existing profile value; coerces empty strings to the profile fallback.
- `asExperienceYears(bodyValue, profileValue)` - Returns a non-negative number of experience years from the form value or falls back to the profile value.
