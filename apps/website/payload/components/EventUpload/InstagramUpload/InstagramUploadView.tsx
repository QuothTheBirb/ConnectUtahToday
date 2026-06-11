import { DefaultTemplate } from "@payloadcms/next/templates";
import { Gutter, SetStepNav } from "@payloadcms/ui";
import { AdminViewServerProps } from "payload";
import { InstagramUpload } from "@/payload/components/EventUpload/InstagramUpload/InstagramUpload";

export const InstagramUploadView = ({
	initPageResult,
	params,
	searchParams,
}: AdminViewServerProps) => {
	if (!initPageResult.req.user) {
		return <p>You must be logged in to view this page.</p>;
	}

	return (
		<DefaultTemplate
			i18n={initPageResult.req.i18n}
			payload={initPageResult.req.payload}
			params={params}
			searchParams={searchParams}
			permissions={initPageResult.permissions}
			user={initPageResult.req.user || undefined}
			visibleEntities={initPageResult.visibleEntities}
		>
			<Gutter className={"collection-list"}>
				<SetStepNav
					nav={[
						{
							label: "Events",
							url: "/dashboard/collections/events",
						},
						{ label: "Poster Event Upload" },
					]}
				/>
				<header className={"list-header"}>
					<div className={"list-header__content"}>
						<div className="list-header__title-and-actions">
							<h1 className={"list-header__title"}>
								Instagram Event Upload
							</h1>
							<p
								style={{
									color: "var(--theme-elevation-500)",
									marginTop: 0,
								}}
							>
								Upload one or more event posters. Each poster
								will be scanned and parsed into a draft event.
								Review and edit the parsed data in the tabs
								below, then submit to add them to the Events
								collection.
							</p>
						</div>
					</div>
				</header>
				<InstagramUpload />
			</Gutter>
		</DefaultTemplate>
	);
};
