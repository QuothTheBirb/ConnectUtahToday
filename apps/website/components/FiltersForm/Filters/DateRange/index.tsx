import { Dispatch, SetStateAction } from "react";
import { FormField } from "@/components/form/FormField";

import styles from "./DateRange.module.scss";

export const DateRangeFilter = ({
	dateRange,
	setDateRange,
	className,
}: {
	dateRange: {
		start: string;
		end: string;
	};
	setDateRange: Dispatch<
		SetStateAction<{
			start: string;
			end: string;
		}>
	>;
	className?: string;
}) => {
	const { start, end } = dateRange;

	return (
		<FormField label={"Date Range"} id={"date-range"} className={className}>
			<div className={styles.dateRange}>
				<input
					type={"date"}
					value={start}
					onChange={(event) =>
						setDateRange((prevState) => ({
							...prevState,
							start: event.target.value,
						}))
					}
					className={styles.dateInput}
				/>
				<span className={styles.separator}>–</span>
				<input
					type={"date"}
					value={end}
					onChange={(event) =>
						setDateRange((prevState) => ({
							...prevState,
							end: event.target.value,
						}))
					}
					className={styles.dateInput}
				/>
			</div>
		</FormField>
	);
};
