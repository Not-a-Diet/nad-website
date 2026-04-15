/** @deprecated Replaced by Google Calendar bookings. Do not use. */
export default function FormSubmit({
  placeholder,
  text,
}: {
  placeholder: string;
  text: string;
}) {
  return (
    <div className="flex flex-row items-center self-center justify-center flex-shrink-0 shadow-md lg:justify-end">
      <div className="flex flex-col">
        <div className="flex flex-row">
          <input
            type="email"
            placeholder={placeholder}
            className={"w-3/5 p-3 rounded-l-lg sm:w-2/3 text-gray-700"}
            disabled
          />
          <button
            type="button"
            className="w-2/5 p-3 font-semibold rounded-r-lg sm:w-1/3 bg-ebony text-white"
            disabled
          >
            {text}
          </button>
        </div>
      </div>
    </div>
  );
}
