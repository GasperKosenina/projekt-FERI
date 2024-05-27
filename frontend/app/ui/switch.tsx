import { useState, useEffect } from "react";
import { Switch, Modal, Box, Typography, Button } from "@mui/material";

interface PublicPrivateSwitchProps {
    onChange: (isPublic: boolean) => void;
    datasetId: string;
    updateShowStatus: (id: string, show: boolean) => void;
    initialShowState?: boolean;
    validCunsomers: number;
}

const PublicPrivateSwitch: React.FC<PublicPrivateSwitchProps> = ({ onChange, datasetId, updateShowStatus, initialShowState, validCunsomers }) => {
    const [isPublic, setIsPublic] = useState(initialShowState);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        setIsPublic(initialShowState);
    }, [initialShowState]);

    const handleSwitchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newState = event.target.checked;
        setIsPublic(newState);
        onChange(newState);
        updateShowStatus(datasetId, newState);
        if (!newState) {
            setIsModalOpen(true);
        }
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    return (
        <div className="flex items-center">
            <p className="mr-14 text-sm text-gray-400">Set visibility of your dataset</p>
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
            <Modal
                open={isModalOpen}
                onClose={closeModal}
                aria-labelledby="modal-title"
                aria-describedby="modal-description"
            >
                <Box
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        bgcolor: 'background.paper',
                        boxShadow: 24,
                        p: 4,
                        borderRadius: 1,
                        outline: 'none',
                        width: '90%',
                        maxWidth: 500,
                    }}
                >
                    <Typography id="modal-description" sx={{ mt: 2 }} className="text-sm text-gray-500">
                       <strong>{validCunsomers}</strong> Data Consumer/s currently have access to your dataset and will retain access until their access tokens expire. No one else can purchase access to your dataset until you make it visible again.
                    </Typography>
                    <Button onClick={closeModal} variant="contained" sx={{ mt: 3 }}>
                        Close
                    </Button>
                </Box>
            </Modal>
        </div>
    );
};

export default PublicPrivateSwitch;
