"use client";
import Link from "next/link";
import { ButtonComponent } from "./button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  ClockIcon,
  CurrencyEuroIcon,
  DocumentTextIcon,
  KeyIcon,
  LinkIcon,
  ArrowDownIcon,
  CheckBadgeIcon,
} from "@heroicons/react/24/outline";
import { useState } from "react";
import { postDataset } from "@/lib/data";
import { useFormState } from "react-dom";
import { ChevronRight } from "lucide-react";

export default function Form() {
  const [position, setPosition] = useState("");
  const initialState = { message: "", errors: {} };
  const [state, dispatch] = useFormState(postDataset, initialState);


  const [checkboxes, setCheckboxes] = useState([
    { id: 1, label: 'Research (using dataset for scientific research)', checked: false, price: 0 },
    { id: 2, label: 'Education (using dataset for pedagogical purposes)', checked: false, price: 0 },
    { id: 3, label: 'Public administration processes', checked: false, price: 0 },
    { id: 4, label: 'Comparative analysis (benchmarking)', checked: false, price: 0 },
    { id: 5, label: 'Machine learning', checked: false, price: 0 },
    { id: 6, label: 'Business analytics (commercial)', checked: false, price: 0 },
  ]);

  const handleCheckboxChange = (id: any) => {
    setCheckboxes(prevCheckboxes =>
      prevCheckboxes.map(checkbox =>
        checkbox.id === id ? { ...checkbox, checked: !checkbox.checked } : checkbox

      )
    );
  };

  const handlePriceChange = (id: any, event: any) => {
    const newPrice = parseFloat(event.target.value);
    setCheckboxes(prevCheckboxes =>
      prevCheckboxes.map(checkbox =>
        checkbox.id === id ? { ...checkbox, price: newPrice } : checkbox
      )
    );
  };

  const appendCategory = (formData: FormData) => {
    const category = position;
    formData.append("category", category);
  };



  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    appendCategory(formData);

    const purposeAndPriceArray: { purpose: string; price: number }[] = [];

    checkboxes.forEach(checkbox => {
      if (checkbox.checked) {
        const purposeAndPriceObject = { purpose: checkbox.label, price: checkbox.price };
        purposeAndPriceArray.push(purposeAndPriceObject);
      }
    });

    const purposeAndPriceString = JSON.stringify(purposeAndPriceArray);
    formData.append('purposeAndPrice', purposeAndPriceString);

    dispatch(formData);
  };



  return (
    <>
      <form action={dispatch} onSubmit={handleSubmit}>
        <div className="rounded-md bg-gray-50 p-4 md:p-6">
          <div className="mb-8">
            <div className="flex gap-1">
              <label htmlFor="name" className="mb-2 block text-sm font-medium">
                Name
              </label>
              <ChevronRight className="h-5 w-5 text-gray-500" />
              <p className="text-sm text-gray-500">Name of the dataset</p>
            </div>
            <div className="relative mt-2 rounded-md">
              <div className="relative">
                <input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Enter name"
                  className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                  aria-describedby="name-error"
                />
                <DocumentTextIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
              </div>
              <div id="name-error" aria-live="polite" aria-atomic="true">
                {state?.errors?.name &&
                  state.errors.name.map((error: string) => (
                    <p className="mt-2 text-sm text-red-500" key={error}>
                      {error}
                    </p>
                  ))}
              </div>
            </div>
          </div>
          <div className="mb-8">
            <div className="flex gap-1">
              <label htmlFor="url" className="mb-2 block text-sm font-medium">
                Url
              </label>
              <ChevronRight className="h-5 w-5 text-gray-500" />
              <p className="text-sm text-gray-500">Link to the dataset file</p>
            </div>
            <div className="relative mt-2 rounded-md">
              <div className="relative">
                <input
                  id="url"
                  name="url"
                  type="text"
                  placeholder="Enter url"
                  className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                  aria-describedby="url-error"
                />
                <LinkIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
              </div>
            </div>
            <div id="url-error" aria-live="polite" aria-atomic="true">
              {state?.errors?.url &&
                state.errors.url.map((error: string) => (
                  <p className="mt-2 text-sm text-red-500" key={error}>
                    {error}
                  </p>
                ))}
            </div>
          </div>
          <div className="mb-6">
            <div className="flex gap-1 mb-2">
              <label
                htmlFor="schema"
                className="mb-2 block text-sm font-medium"
              >
                Schema
              </label>
              <ChevronRight className="h-5 w-5 text-gray-500" />
              <p className="text-sm text-gray-500">
                Choose the schema file (JSON) for the dataset
              </p>
            </div>
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Input id="schema" name="schema" type="file" />
            </div>
            <div id="schema-error" aria-live="polite" aria-atomic="true">
              {state?.errors?.description &&
                state.errors.description.map((error: string) => (
                  <p className="mt-2 text-sm text-red-500" key={error}>
                    {error}
                  </p>
                ))}
            </div>
          </div>
          <div className="mb-8">
            <div className="flex-1">
              <label className="mb-2 block text-sm font-medium invisible">
                Choose Category
              </label>
              <div className="flex items-center gap-3">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button className="w-50">Choose category</Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56">
                    <DropdownMenuSeparator />
                    <DropdownMenuRadioGroup
                      value={position}
                      onValueChange={setPosition}
                    >
                      <DropdownMenuRadioItem value="healthcare">
                        Healthcare
                      </DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="technology">
                        Technology
                      </DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="sport">
                        Sport
                      </DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="finance">
                        Finance
                      </DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="education">
                        Education
                      </DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="environment">
                        Environment
                      </DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="agriculture">
                        Agriculture
                      </DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="Other">
                        Other
                      </DropdownMenuRadioItem>
                    </DropdownMenuRadioGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
                <div>
                  {position && (
                    <p className="text-sm text-gray-500">
                      {position.charAt(0).toUpperCase() + position.slice(1)}
                    </p>
                  )}
                </div>
              </div>
              <div id="category-error" aria-live="polite" aria-atomic="true">
                {state?.errors?.category &&
                  state.errors.category.map((error: string) => (
                    <p className="mt-2 text-sm text-red-500" key={error}>
                      {error}
                    </p>
                  ))}
              </div>
            </div>
          </div>
          <div className="mb-8 flex">
            <div className="flex-1 mr-6">
              <div className="flex mb-2 gap-1">
                <label
                  htmlFor="accessToken"
                  className="mb-2 block text-sm font-medium"
                >
                  Secret Token
                </label>
                <ChevronRight className="h-5 w-5 text-gray-500" />
                <p className="text-sm text-gray-500">
                  Enter a secret token to secure the dataset
                </p>
              </div>

              <div className="relative">
                <input
                  id="accessToken"
                  name="accessToken"
                  type="password"
                  placeholder="Enter secret token"
                  className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                  aria-describedby="accessToken-error"
                />
                <KeyIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
              </div>

              <div id="accessToken-error" aria-live="polite" aria-atomic="true">
                {state?.errors?.accessToken &&
                  state.errors.accessToken.map((error: string) => (
                    <p className="mt-2 text-sm text-red-500" key={error}>
                      {error}
                    </p>
                  ))}
              </div>
            </div>
            <div className="flex-1 ml-2">
              <div className="flex mb-2 gap-1">
                <label
                  htmlFor="duration"
                  className="mb-2 block text-sm font-medium"
                >
                  Token Duration
                </label>
                <ChevronRight className="h-5 w-5 text-gray-500" />
                <p className="text-sm text-gray-500">
                  Enter the duration of the token in minutes (1 - 1440)
                </p>
              </div>
              <div className="relative">
                <input
                  id="duration"
                  name="duration"
                  type="text"
                  placeholder="Enter token duration"
                  className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                  aria-describedby="duration-error"
                />
                <ClockIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
              </div>
              <div id="duration-error" aria-live="polite" aria-atomic="true">
                {state?.errors?.duration &&
                  state.errors.duration.map((error: string) => (
                    <p className="mt-2 text-sm text-red-500" key={error}>
                      {error}
                    </p>
                  ))}
              </div>
            </div>
          </div>
          <div className="mb-8">
            <div className="max-wmx-auto mt-4 bg-gray-50">
              <div className="flex mb-2 gap-1">
                <label
                  htmlFor="duration"
                  className="mb-2 block text-sm font-medium"
                >
                  Purpose
                </label>
                <ChevronRight className="h-5 w-5 text-gray-500" />
                <p className="text-sm text-gray-500">
                  Enter the price for specific purpose of dataset usage
                </p>
              </div>

              {checkboxes.map(checkbox => (
                <div key={checkbox.id} className="flex items-center mb-2">
                  <input
                    type="checkbox"
                    id={`checkbox-${checkbox.id}`}
                    checked={checkbox.checked}
                    onChange={() => handleCheckboxChange(checkbox.id)}
                    className="mr-2"
                    aria-describedby="price-error"
                  />
                  <label htmlFor={`checkbox-${checkbox.id}`} className="text-sm">{checkbox.label}</label>
                  {checkbox.checked && (
                    <input
                      type="number"
                      value={checkbox.price}
                      onChange={(event) => handlePriceChange(checkbox.id, event)}
                      className="ml-auto px-2 py-2 border border-gray-300 rounded text-sm outline-2 placeholder:text-gray-500"
                      step="0.01"
                      placeholder="Enter EUR Price"

                    />
                  )}
                </div>
              ))}
            </div>
            <div id="price-error" aria-live="polite" aria-atomic="true">
              {state?.errors?.price &&
                state.errors.price.map((error: string) => (
                  <p className="mt-2 text-sm text-red-500" key={error}>
                    {error}
                  </p>
                ))}
            </div>
          </div>
          <div aria-live="polite" aria-atomic="true">
            {state.message ? (
              <p className="mt-2 text-sm text-red-500">{state.message}</p>
            ) : null}
          </div>
          <div className="mt-10 flex gap-4">
            <Link
              href="/dashboard/datasets"
              className="flex h-10 items-center rounded-lg bg-gray-300 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
            >
              Cancel
            </Link>
            <ButtonComponent type="submit">Publish dataset</ButtonComponent>
          </div>
        </div>
      </form>
    </>
  );
}
