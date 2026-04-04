import type { Metadata } from "next";

import { DisclaimerButton, DisclaimerPopup } from "@/components/Disclaimer";
import { Events } from "@/components/Events";
import { PageCard } from "@/components/PageCard";
import { PageHeading } from "@/components/PageHeading";
import { getEventsForMonth } from "@/lib/api/getEventsForMonth";

import styles from "./EventsPage.module.scss";

export const metadata: Metadata = {
	title: "Events",
};

const EventsPage = async ({
	searchParams,
}: {
	searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) => {
	const params = await searchParams;

	const now = new Date();
	const year = params.year ? Number(params.year) : now.getFullYear();
	const month = params.month ? Number(params.month) - 1 : now.getMonth();

	const events = await getEventsForMonth({ year, month });

	return (
		<PageCard>
			<PageHeading heading={"h1"}>Events</PageHeading>
			<DisclaimerButton className={styles.disclaimerButton} />
			<Events monthEvents={events} date={{ year, month }} />
			<DisclaimerPopup>
				<p>
					<strong>Disclaimer:</strong> Connect Utah Today provides a
					list of events for informational purposes only. We do not
					organize, operate, or officially endorse any of the events
					listed on this website unless explicitly stated. Event
					details, dates, times, and locations are subject to change
					without notice. Connect Utah Today is not responsible for
					the accuracy, reliability, or completeness of the
					information provided, nor for any issues, injuries, or
					losses that may arise from your participation in any event.
					Please verify event details directly with the event
					organizer before attending. By using this website, you
					acknowledge and accept that Connect Utah Today is not liable
					for any consequences resulting from your participation in or
					reliance on any event listed.
				</p>
			</DisclaimerPopup>
		</PageCard>
	);
};

export default EventsPage;
