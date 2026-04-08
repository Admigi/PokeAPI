export default function SkeletonCard() {
	return (
		<div className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm animate-pulse">
			<div className="bg-gray-100 min-h-[140px]" />
			<div className="px-4 pt-3 pb-4">
				<div className="h-4 bg-gray-100 rounded-full mb-3 w-3/4" />
				<div className="flex gap-1.5 mb-3">
					<div className="h-5 w-14 bg-gray-100 rounded-full" />
					<div className="h-5 w-14 bg-gray-100 rounded-full" />
				</div>
				<div className="h-4" />
			</div>
		</div>
	);
}
