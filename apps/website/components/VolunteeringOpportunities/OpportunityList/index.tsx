"use client";

import { Mail, Phone, SquareArrowOutUpRight } from "lucide-react";
import React from "react";
import RichText from "@/components/RichText";
import { Organization } from "@/payload-types";

import styles from "../VolunteeringOpportunities.module.scss";

interface OpportunityListProps {
	organizations: Organization[];
}

export const OpportunityList = ({ organizations }: OpportunityListProps) => {
	if (!organizations.length) {
		return (
			<div className={styles.noOppsMsg}>
				No matching organizations found.
			</div>
		);
	}

	return (
		<>
			{organizations.map((org) => {
				const activities =
					org.opportunities
						?.map((opp) =>
							typeof opp === "object" ? opp.name : "",
						)
						.filter(Boolean) || [];

				const logo =
					typeof org.logo === "object" ? org.logo?.url : org.logo;

				return (
					<div className={styles.opportunityItem} key={org.id}>
						{logo ? (
							<img
								src={logo}
								alt={org.name}
								className={styles.opportunityImg}
							/>
						) : (
							<div className={styles.opportunityImg} />
						)}
						<div className={styles.opportunityContent}>
							<div className={styles.opportunityOrg}>
								{org.name}
							</div>
							{activities.length > 0 && (
								<ul className={styles.opportunityActivities}>
									{activities.map((a, i) => (
										<li key={i}>{a}</li>
									))}
								</ul>
							)}
							{org.description && (
								<RichText
									content={org.description}
									className={styles.opportunityDescription}
								/>
							)}
							{(() => {
								const contactMethods = org.publicContactMethods;
								const links: React.ReactNode[] = [];
								if (
									contactMethods?.showEmail &&
									contactMethods.contactEmail
								)
									links.push(
										<a
											key="email"
											href={`mailto:${contactMethods.contactEmail}`}
											className={styles.orgLink}
										>
											<Mail size={16} />
											{contactMethods.contactEmailLabel ||
												"Email"}
										</a>,
									);
								if (
									contactMethods?.showPhone &&
									contactMethods.contactPhone
								)
									links.push(
										<a
											key="phone"
											href={`tel:${contactMethods.contactPhone}`}
											className={styles.orgLink}
										>
											<Phone size={16} />
											{contactMethods.contactPhoneLabel ||
												"Phone"}
										</a>,
									);
								if (
									contactMethods?.showWebsite &&
									contactMethods.contactWebsite
								)
									links.push(
										<a
											key="website"
											href={contactMethods.contactWebsite}
											target="_blank"
											rel="noopener noreferrer"
											className={styles.orgLink}
										>
											<SquareArrowOutUpRight size={16} />
											{contactMethods.contactWebsiteLabel ||
												"Website"}
										</a>,
									);
								return links.length > 0 ? (
									<div className={styles.contactMethods}>
										{links}
									</div>
								) : null;
							})()}
						</div>
					</div>
				);
			})}
		</>
	);
};

export default OpportunityList;
