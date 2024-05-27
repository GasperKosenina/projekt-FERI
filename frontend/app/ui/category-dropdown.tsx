'use client';


import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import { SelectChangeEvent } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useSearchParams, usePathname, useRouter } from 'next/navigation';

type Category = {
    value: string;
    label: string;
};

const categories: Category[] = [
    { value: '', label: 'All' },
    { value: 'healthcare', label: 'Healthcare' },
    { value: 'technology', label: 'Technology' },
    { value: 'sport', label: 'Sport' },
    { value: 'finance', label: 'Finance' },
    { value: 'education', label: 'Education' },
    { value: 'environment', label: 'Environment' },
    { value: 'agriculture', label: 'Agriculture' },
    { value: 'other', label: 'Other' }
];

const CategoryDropdown: React.FC = () => {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { replace } = useRouter();

    const [selectedCategory, setSelectedCategory] = useState<string>('');

    useEffect(() => {
        const currentCategory = searchParams.get('category');
        if (currentCategory) {
            setSelectedCategory(currentCategory);
        }
    }, [searchParams]);

    const handleChange = (event: SelectChangeEvent<string>) => {
        const value = event.target.value as string;
        setSelectedCategory(value);
        const params = new URLSearchParams(searchParams);
        if (value) {
            params.set('category', value);
        } else {
            params.delete('category');
        }
        replace(`${pathname}?${params.toString()}`);
    };

    return (
        <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
            <InputLabel id="category-select-label">Category</InputLabel>
            <Select
                labelId="category-select-label"
                id="category-select"
                value={selectedCategory}
                label="Category"
                onChange={handleChange}
            >
                {categories.map((category) => (
                    <MenuItem key={category.value} value={category.value}>{category.label}</MenuItem>
                ))}
            </Select>
        </FormControl>
    );
};

export default CategoryDropdown;
