import { Suspense } from "react";
import { InquiryForm } from "./InquiryForm";

export function InquiryFormWrapper(props: {
  defaultProduct?: string;
  defaultRequestType?: string;
}) {
  return (
    <Suspense fallback={<div className="h-96 animate-pulse rounded-lg bg-[#F4F6F8]" />}>
      <InquiryForm {...props} />
    </Suspense>
  );
}
