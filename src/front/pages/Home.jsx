import React, { useEffect } from "react"
import DonationForm from "../components/DonationForm";

export const Home = () => {

	return (
		<div className="text-center mt-5">
			<h1 className="display-4">Paypal Test from Front</h1>
			<DonationForm />
		</div>
	);
}; 