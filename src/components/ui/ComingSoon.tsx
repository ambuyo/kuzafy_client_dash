import React from 'react';

export default function ComingSoon({
  title,
  description,
  icon: Icon,
}: {
  title: string;
  description: string;
  icon: React.ElementType;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-100 mb-4">
        <Icon className="h-8 w-8 text-orange-500" />
      </div>
      <h1 className="text-xl font-bold text-gray-900">{title}</h1>
      <p className="mt-2 max-w-xs text-sm text-gray-400">{description}</p>
      <span className="mt-5 rounded-full bg-yellow-100 px-3 py-1 text-xs font-semibold text-yellow-700">
        Coming soon
      </span>
    </div>
  );
}
