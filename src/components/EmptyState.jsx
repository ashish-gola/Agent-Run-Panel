import PropTypes from "prop-types";

export default function EmptyState({ onStartSuccess, onStartError }) {
  return (
    <section className="rounded-2xl border border-white/10 bg-[#262d3f] p-8 text-center shadow-[0_12px_28px_rgba(8,12,22,0.28)] sm:p-10">
      <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-lg font-semibold text-[#F1E8C7]">
        run
      </div>
      <h2 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
        Nothing loaded yet.
      </h2>
      <p className="mx-auto mt-3 max-w-2xl text-base leading-7 text-[#D7E0E8]">
        Pick one of the sample runs to replay the event stream and check how the panel lays out the tasks.
      </p>

      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          onClick={onStartSuccess}
          className="rounded-full border border-[#E1D9BC]/40 bg-[#E1D9BC] px-5 py-2.5 text-sm font-semibold text-[#30364F] transition-colors duration-200 hover:bg-[#EFE3B9]"
        >
          Load sample run
        </button>
        <button
          type="button"
          onClick={onStartError}
          className="rounded-full border border-white/10 bg-[#273042] px-5 py-2.5 text-sm font-semibold text-[#F5F8FA] transition-colors duration-200 hover:border-white/20 hover:bg-[#30384d]"
        >
          Load error run
        </button>
      </div>
    </section>
  );
}

EmptyState.propTypes = {
  onStartSuccess: PropTypes.func.isRequired,
  onStartError: PropTypes.func.isRequired,
};