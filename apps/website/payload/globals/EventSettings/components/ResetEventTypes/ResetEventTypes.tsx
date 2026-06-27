"use client";

import {
	Button,
	ConfirmationModal,
	toast,
	useForm,
	useModal,
} from "@payloadcms/ui";
import { UIFieldClientComponent } from "payload";
import React, { useEffect, useState } from "react";
import { defaultEventTypes } from "@/payload/globals/EventSettings/tabs/defaultEventTypes";

const MODAL_SLUG = "reset-event-types-confirm";

export const ResetEventTypes: UIFieldClientComponent = () => {
	const { openModal, closeModal } = useModal();
	const [processing, setProcessing] = useState(false);
	const { replaceState, getFields, setModified } = useForm();
	const fields = getFields();

	useEffect(() => {
		console.log(fields);
	}, [fields]);

	// Nobody will ever know I spent 6+ hours trying to figure out how to get this to work
	const handleConfirm = async () => {
		setProcessing(true);

		const newState = { ...fields };

		newState["eventTypes"] = {
			initialValue: defaultEventTypes.length,
			value: defaultEventTypes.length,
			valid: true,
			disableFormData: true,
		};

		defaultEventTypes.forEach((eventType, i) => {
			newState[`eventTypes.${i}.title`] = {
				initialValue: eventType.title,
				value: eventType.title,
				valid: true,
			};
			newState[`eventTypes.${i}.description`] = {
				initialValue: eventType.description ?? "",
				value: eventType.description ?? "",
				valid: true,
			};
			newState[`eventTypes.${i}.mobilizeEventTypes`] = {
				initialValue: eventType.mobilizeEventTypes,
				value: eventType.mobilizeEventTypes,
				valid: true,
			};
		});

		// Remove any extra event types that exist in the current state but not in defaults
		const currentCount = Number(fields["eventTypes."]?.value);
		if (currentCount > defaultEventTypes.length) {
			for (let i = defaultEventTypes.length; i < currentCount; i++) {
				delete newState[`eventTypes.${i}.title`];
				delete newState[`eventTypes.${i}.description`];
				delete newState[`eventTypes.${i}.mobilizeEventTypes`];
				delete newState[`eventTypes.${i}.id`];
			}
		}

		replaceState(newState);
		setModified(true);

		toast.success("Event types set to the default values.");
		setProcessing(false);
		closeModal(MODAL_SLUG);
	};

	return (
		<>
			<Button
				onClick={() => openModal(MODAL_SLUG)}
				disabled={processing}
				margin={false}
			>
				Reset Event Types
			</Button>
			<ConfirmationModal
				modalSlug={MODAL_SLUG}
				onConfirm={handleConfirm}
				onCancel={() => closeModal(MODAL_SLUG)}
				body={
					<p>
						Are you sure you want to reset event types to the
						default values?
					</p>
				}
				heading={<h2>Reset Event Types</h2>}
			/>
		</>
	);
};
