"use client";

import { useState } from "react";
import { Switch } from "@mui/material"; 

interface PublicPrivateSwitchProps {
    initialState: boolean;
    onChange: (isPublic: boolean) => void;
}

const PublicPrivateSwitch: React.FC<PublicPrivateSwitchProps> = ({ initialState, onChange }) => {
    const [isPublic, setIsPublic] = useState(initialState);

    const handleSwitchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newState = event.target.checked;
        setIsPublic(newState);
        onChange(newState);
    };

    return (
        <div className="flex items-center">
            <label htmlFor="public-private-switch" className="mr-2 text-sm font-medium text-gray-700">
                {isPublic ? "Public" : "Private"}
            </label>
            <Switch
                checked={isPublic}
                onChange={handleSwitchChange}
                color="primary"
                name="public-private-switch"
                inputProps={{ 'aria-label': 'public private switch' }}
            />
        </div>
    );
};

export default PublicPrivateSwitch;
