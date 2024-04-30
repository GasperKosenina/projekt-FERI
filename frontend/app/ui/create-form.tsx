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

export default function Form() {
  const [position, setPosition] = useState("");
  const initialState = { message: "", errors: {} };
  const [state, dispatch] = useFormState(postDataset, initialState);

  const appendCategory = (formData: FormData) => {
    const category = position;
    formData.append("category", category);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    appendCategory(formData);
    dispatch(formData);
  };

  return (
    <>
      <form action={dispatch} onSubmit={handleSubmit}>
        <div className="rounded-md bg-gray-50 p-4 md:p-6">
          <div className="mb-6">
            <label htmlFor="name" className="mb-2 block text-sm font-medium">
              Name
            </label>
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
          <div className="mb-6">
            <label htmlFor="url" className="mb-2 block text-sm font-medium">
              Url
            </label>
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
            <label htmlFor="schema" className="mb-2 block text-sm font-medium">
              Schema
            </label>
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

          <div className="mb-6 flex">
            <div className="flex-1 mr-6">
              <label htmlFor="price" className="mb-2 block text-sm font-medium">
                Price
              </label>
              <div className="relative">
                <input
                  id="price"
                  name="price"
                  type="number"
                  step="0.01"
                  placeholder="Enter EUR Price"
                  className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                  aria-describedby="price-error"
                />
                <CurrencyEuroIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
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
            <div className="flex-1 ml-2">
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

          <div className="mb-6 flex">
            <div className="flex-1 mr-6">
              <label
                htmlFor="accessToken"
                className="mb-2 block text-sm font-medium"
              >
                Secret Token
              </label>
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
              <label
                htmlFor="duration"
                className="mb-2 block text-sm font-medium"
              >
                Token Duration
              </label>
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
