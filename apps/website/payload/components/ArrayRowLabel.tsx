"use client";

import { useRowLabel } from "@payloadcms/ui";

export const ArrayRowLabel = ({ baseLabel }: { baseLabel?: string }) => {
	const { data, rowNumber } = useRowLabel<{ title?: string }>();

	const labelTitle = data.title;
	const rowNumberText = baseLabel
		? `${baseLabel} ${String(rowNumber).padStart(2, "0")}`
		: `${String(rowNumber).padStart(2, "0")}`;

	return <div>{labelTitle ? labelTitle : rowNumberText}</div>;
};
