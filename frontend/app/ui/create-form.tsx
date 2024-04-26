"use client";
import Link from "next/link";
import { Button } from "./button";
import { Input } from "@/components/ui/input";
import {
  CheckIcon,
  ClockIcon,
  CurrencyEuroIcon,
  UserCircleIcon,
  DocumentTextIcon,
  ArrowUpOnSquareIcon,
  KeyIcon,
} from "@heroicons/react/24/outline";
import { postDataset } from "@/lib/data";

export default function Form() {
  return (
    <>
      <form action={postDataset}>
        <div className="rounded-md bg-gray-50 p-4 md:p-6">
          <div className="mb-6">
            <label
              htmlFor="description"
              className="mb-2 block text-sm font-medium"
            >
              Description
            </label>
            <div className="relative mt-2 rounded-md">
              <div className="relative">
                <input
                  id="description"
                  name="description"
                  type="text"
                  placeholder="Enter Description"
                  className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                />
                <DocumentTextIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
              </div>
            </div>
          </div>

          <div className="mb-6">
            <label htmlFor="schema" className="mb-2 block text-sm font-medium">
              Schema
            </label>
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Input id="schema" type="file" />
            </div>
          </div>

          <div className="mb-6">
            <label htmlFor="amount" className="mb-2 block text-sm font-medium">
              Price
            </label>
            <div className="relative mt-2 rounded-md">
              <div className="relative">
                <input
                  id="amount"
                  name="amount"
                  type="number"
                  step="0.01"
                  placeholder="Enter EUR Price"
                  className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                />
                <CurrencyEuroIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
              </div>
            </div>
          </div>

          <div className="mb-6 flex gap-4">
            <div className="flex-1">
              <label htmlFor="token" className="mb-2 block text-sm font-medium">
                Token
              </label>
              <div className="relative rounded-md">
                <input
                  id="token"
                  name="token"
                  type="text"
                  placeholder="Enter token"
                  className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                />
                <KeyIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
              </div>
            </div>

            <div className="flex-1">
              <label
                htmlFor="duration"
                className="mb-2 block text-sm font-medium"
              >
                Expiration Time
              </label>
              <div className="relative rounded-md">
                <input
                  id="expiration"
                  name="expiration"
                  type="expiration"
                  placeholder="Enter Token Expiration Time"
                  className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                />
                <ClockIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
              </div>
            </div>
          </div>

          {/* <fieldset>
          <legend className="mb-2 block text-sm font-medium">
            Set the invoice status
          </legend>
          <div className="rounded-md border border-gray-200 bg-white px-[14px] py-3">
            <div className="flex gap-4">
              <div className="flex items-center">
                <input
                  id="pending"
                  name="status"
                  type="radio"
                  value="pending"
                  className="h-4 w-4 cursor-pointer border-gray-300 bg-gray-100 text-gray-600 focus:ring-2"
                />
                <label
                  htmlFor="pending"
                  className="ml-2 flex cursor-pointer items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-600"
                >
                  Pending
                </label>
              </div>
              <div className="flex items-center">
                <input
                  id="paid"
                  name="status"
                  type="radio"
                  value="paid"
                  className="h-4 w-4 cursor-pointer border-gray-300 bg-gray-100 text-gray-600 focus:ring-2"
                />
                <label
                  htmlFor="paid"
                  className="ml-2 flex cursor-pointer items-center gap-1.5 rounded-full bg-green-500 px-3 py-1.5 text-xs font-medium text-white"
                >
                  Paid
                </label>
              </div>
            </div>
          </div>
        </fieldset> */}

          <div className="mt-6 flex justify-end gap-4">
            <Link
              href="/dashboard/datasets"
              className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
            >
              Cancel
            </Link>
            <Button type="submit">Publish dataset</Button>
          </div>
        </div>
      </form>
    </>
  );
}
