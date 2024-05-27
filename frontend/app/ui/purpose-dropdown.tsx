'use client';


import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import { SelectChangeEvent } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useSearchParams, usePathname, useRouter } from 'next/navigation';

type Purpose = {
    value: string;
    label: string;
};

const purposes: Purpose[] = [
    { value: '', label: 'All' },
    { value: 'research (using dataset for scientific research)', label: 'Research' },
    { value: 'education (using dataset for pedagogical purposes)', label: 'Education' },
    { value: 'public administration processes', label: 'Public administration processes' },
    { value: 'comparative analysis (benchmarking)', label: 'Comparative analysis' },
    { value: 'machine learning', label: 'Machine learning' },
    { value: 'business analytics (commercial)', label: 'Business analytics' },
];

const PurposeDropdown: React.FC = () => {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { replace } = useRouter();

    const [selectedPurpose, setSelectedPurpose] = useState<string>('');

    useEffect(() => {
        const currentPurpose = searchParams.get('category');
        if (currentPurpose) {
            setSelectedPurpose(currentPurpose);
        }
    }, [searchParams]);

    const handleChange = (event: SelectChangeEvent<string>) => {
        const value = event.target.value as string;
        setSelectedPurpose(value);
        const params = new URLSearchParams(searchParams);
        if (value) {
            params.set('purpose', value);
        } else {
            params.delete('purpose');
        }
        replace(`${pathname}?${params.toString()}`);
    };

    return (
        <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
            <InputLabel id="purpose-select-label">Purpose</InputLabel>
            <Select
                labelId="purpose-select-label"
                id="purpose-select"
                value={selectedPurpose}
                label="Purpose"
                onChange={handleChange}
            >
                {purposes.map((purpose) => (
                    <MenuItem key={purpose.value} value={purpose.value}>{purpose.label}</MenuItem>
                ))}
            </Select>
        </FormControl>
    );
};

export default PurposeDropdown;
