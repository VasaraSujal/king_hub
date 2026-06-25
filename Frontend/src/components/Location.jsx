import React from 'react';

const PopularLocalities = () => {
  const localities = [
    { name: 'Bodakdev', places: 485 },
    { name: 'Navrangpura', places: 408 },
    { name: 'Prahlad Nagar', places: 254 },
    { name: 'Satellite', places: 426 },
    { name: 'Vastrapur', places: 308 },
    { name: 'C G Road', places: 113 },
    { name: 'Gurukul', places: 125 },
    { name: 'Thaltej', places: 466 },
  ];

  return (
    <section className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-12">
      <h2 className="text-3xl font-bold text-slate-900 mb-6">Popular Localities</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
      {localities.map((locality) => (
        <div
          key={locality.name}
          className="rounded-2xl border border-blue-100 bg-white/90 px-5 py-4 shadow-sm flex items-center justify-between transition-transform hover:-translate-y-1 hover:shadow-md cursor-pointer"
        >
          <div>
            <p className="text-base font-semibold text-slate-900">{locality.name}</p>
            <p className="text-sm text-slate-500">{locality.places} places</p>
          </div>
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-50 text-blue-700">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        </div>
      ))}
      <div className="rounded-2xl border border-dashed border-blue-200 bg-blue-50/50 px-5 py-4 flex items-center justify-center cursor-pointer hover:bg-blue-100 transition">
        <div className="flex items-center gap-2 text-blue-700 font-semibold">
          <span>See more</span>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path
              fillRule="evenodd"
              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      </div>
    </div>
  </section>
  );
};

export default PopularLocalities;