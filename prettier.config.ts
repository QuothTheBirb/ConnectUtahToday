import { type Config } from "prettier";

const config: Config = {
	plugins: ["@ianvs/prettier-plugin-sort-imports"],
	importOrder: [
		"<TYPES>^(node:)",
		"<TYPES>",
		"<BUILTIN_MODULES>",
		"<THIRD_PARTY_MODULES>",
		"",
		"<TYPES>^@connect-utah-today/(.*)$",
		"<TYPES>^@payload-config$",
		"<TYPES>^[.]",
		"^@connect-utah-today/(.*)$",
		"^@payload-config$",
		"^@/(.*)$",
		"^[.]",
	],
	// Required for any side effect imports (i.e. import "dotenv/config")
	importOrderSafeSideEffects: ["^server-only$", "^dotenv/config$"],
};

export default config;
