'use client';

import { useState, useEffect } from 'react';
import Modal1 from "@/app/ui/modal_jsonschema";
import { Dataset } from "@/lib/definitions";
import PublicPrivateSwitch from './switch';
import { updateShowStatus } from '@/lib/data';

function formatDate(dateString: any) {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });
}

interface DatasetPageProps {
    dataset: Dataset;
}

const DatasetPage: React.FC<DatasetPageProps> = ({ dataset }) => {
    const [isPublic, setIsPublic] = useState(true);

    const handleSwitchChange = (newState: boolean) => {
        setIsPublic(newState);
        console.log("Dataset is now", newState ? "Public" : "Private");
    };

    console.log(dataset)


    return (
        <>
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold" style={{ color: '#3b82f6' }}>{dataset.name}</h1>
                <PublicPrivateSwitch
                    initialShowState={dataset.show} 
                    onChange={handleSwitchChange}
                    datasetId={dataset.id || ''}
                    updateShowStatus={updateShowStatus}
                />
            </div>
            <div className="mt-8 mx-auto w-full max-w-full bg-white overflow-hidden sm:rounded-lg outline outline-1 outline-gray-200">
                <div className="outline outline-1 border-gray-200">
                    <dl className="divide-y divide-gray-200">
                        <div className="px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt className="text-sm font-medium text-gray-500">URL</dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                <a href={dataset.url} className="text-blue-500 hover:underline">
                                    {dataset.url}
                                </a>
                            </dd>
                        </div>
                        <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt className="text-sm font-medium text-gray-500">Category</dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                {dataset.category}
                            </dd>
                        </div>
                        <div className="px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt className="text-sm font-medium text-gray-500">Duration</dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                {dataset.duration} hours
                            </dd>
                        </div>
                        <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt className="text-sm font-medium text-gray-500">Date</dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                {formatDate(dataset.createdAt)}
                            </dd>
                        </div>
                        <div className="px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt className="text-sm font-medium text-gray-500">Price Details</dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                <ul>
                                    {dataset.price.map((item, index) => (
                                        <li key={index} className="mb-2">
                                            <span className="font-semibold"></span>{item.purpose}<br />
                                            <span className="font-semibold"></span>${item.price.toFixed(2)}
                                        </li>
                                    ))}
                                </ul>
                            </dd>
                        </div>
                        <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt className="text-sm font-medium text-gray-500">
                                Dataset description
                            </dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                <Modal1 description={dataset.description} />
                            </dd>
                        </div>
                    </dl>
                </div>
            </div>
        </>
    );
};

export default DatasetPage;
