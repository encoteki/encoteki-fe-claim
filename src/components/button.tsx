export default function WalletButton({
  onClick,
  label,
}: {
  onClick?: () => void
  label: string
}) {
  return (
    <>
      {onClick && (
        <button
          onClick={onClick}
          type="button"
          className="w-full cursor-pointer rounded-4xl bg-(--primary-green) py-3 duration-300 hover:scale-105 hover:bg-(--green-10) md:px-6 md:py-4"
        >
          <p className="font-medium text-white marker:text-sm md:text-base">
            {label}
          </p>
        </button>
      )}
    </>
  )
}
