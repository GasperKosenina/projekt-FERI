import { useState, useEffect } from "react";
import { Switch } from "@mui/material";

interface PublicPrivateSwitchProps {
    onChange: (isPublic: boolean) => void;
    datasetId: string;
    updateShowStatus: (id: string, show: boolean) => void;
    initialShowState?: boolean;
}

const PublicPrivateSwitch: React.FC<PublicPrivateSwitchProps> = ({ onChange, datasetId, updateShowStatus, initialShowState }) => {
    const [isPublic, setIsPublic] = useState(initialShowState);

    useEffect(() => {
        setIsPublic(initialShowState);
    }, [initialShowState]);

    const handleSwitchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newState = event.target.checked;
        setIsPublic(newState);
        onChange(newState);
        updateShowStatus(datasetId, newState);
    };

    return (
        <div className="flex items-center">
            <p className="mr-14 text-sm text-gray-400">Set visibilty of your dataset</p>
            <label htmlFor="public-private-switch" className="mr-2 text-sm font-medium text-gray-700">
                {isPublic ? "Show" : "Hide"}
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
