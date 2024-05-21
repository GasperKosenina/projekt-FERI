"use client";


import { useState } from "react";
import { ButtonComponent } from "./button";
import PaymentButton from "@/components/ui/paypalButton";

interface ModalProps {
    dataset: any;
    datasetId: string;
    amount: string | undefined;
    mongoUser: any;
    userId: any;
}

export default function RequestAccess({ dataset, datasetId, amount, mongoUser, userId }: ModalProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const toggleModal = () => {
        setIsModalOpen(!isModalOpen);
    };


    const payee = mongoUser.email;




    return (
        <div>
            <ButtonComponent
                className="bg-blue-500 hover:bg-blue-400 active:bg-gray-500 text-white font-bold py-2 px-4 rounded mt-5"
                onClick={toggleModal}
            >
                Request access
            </ButtonComponent>

            {isModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-75">
                    <div className="relative bg-white p-6 rounded shadow-lg w-3/4 max-w-2xl">
                        <button
                            className="absolute top-2 right-6 text-gray-500 hover:text-red-600 text-4xl"
                            onClick={toggleModal}
                        >
                            &times;
                        </button>
                        <h2 className="text-xl font-bold mb-4">Request Access Information</h2>
                        <div>{dataset.id}</div>
                        <div className="mt-10">
                            {mongoUser.id !== userId && (
                                <PaymentButton
                                    datasetId={datasetId}
                                    payee={mongoUser.email}
                                    amount={amount}
                                />
                            )}
                        </div>
                    </div>

                </div>
            )}
        </div>
    )


}
