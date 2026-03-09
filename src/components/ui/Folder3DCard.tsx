interface Folder3DCardProps {
  name: string;
  photoCount: number;
  coverPhoto?: string;
  onClick: () => void;
}

export function Folder3DCard({
  name,
  photoCount,
  coverPhoto,
  onClick,
}: Folder3DCardProps) {
  return (
    <div
      className="group relative flex flex-col items-center justify-center w-full h-full cursor-pointer"
      onClick={onClick}
    >
      <div
        className="file relative w-68 h-48 origin-bottom z-50"
        style={{ perspective: "1500px" }}
      >
        <div
          className="work-5 absolute inset-0 bg-amber-600 w-full h-full origin-top rounded-2xl rounded-tl-none shadow-lg transition-all ease duration-300 group-hover:shadow-[0_20px_40px_rgba(0,0,0,.2)]"
          style={{
            transformOrigin: "bottom",
          }}
        >
          {/* Left folder tab - ::after simulation */}
          <div className="absolute bottom-[99%] left-0 w-20 h-4 bg-amber-600 rounded-t-2xl" />
          {/* Angled corner - ::before simulation */}
          <div
            className="absolute -top-[15px] left-[75.5px] w-4 h-4 bg-amber-600"
            style={{
              clipPath: "polygon(0 35%, 0% 100%, 50% 100%)",
            }}
          />
        </div>

        {/* Layer 4 - Zinc 400 */}
        <div className="work-4 absolute inset-1 bg-zinc-400 rounded-2xl transition-all ease duration-300 origin-bottom group-hover:[transform:rotateX(-20deg)]" />

        {/* Layer 3 - Zinc 300 */}
        <div className="work-3 absolute inset-1 bg-zinc-300 rounded-2xl transition-all ease duration-300 origin-bottom group-hover:[transform:rotateX(-30deg)]" />

        {/* Layer 2 - Zinc 200 */}
        <div className="work-2 absolute inset-1 bg-zinc-200 rounded-2xl transition-all ease duration-300 origin-bottom group-hover:[transform:rotateX(-38deg)]" />

        {/* Layer 1 - Front (amber gradient) with right folder tab and content */}
        <div
          className="work-1 absolute bottom-0 w-full h-[156px] rounded-2xl transition-all ease duration-300 origin-bottom flex items-end overflow-hidden group-hover:[transform:rotateX(-46deg)_translateY(1px)]"
          style={{
            background: "linear-gradient(to top, #f59e0b, #fbbf24)",
            transformOrigin: "bottom",
          }}
        >
          {/* Right folder tab - ::after simulation */}
          <div className="absolute bottom-[99%] right-0 w-[146px] h-4 bg-amber-400 rounded-t-2xl" />
          {/* Angled corner - ::before simulation */}
          <div
            className="absolute -top-[10px] right-[142px] w-3 h-3 bg-amber-400"
            style={{
              clipPath: "polygon(100% 14%, 50% 100%, 100% 100%)",
            }}
          />
          {coverPhoto && (
            <div className="absolute inset-0">
              
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(to top, rgba(245, 158, 11, 0.9), rgba(251, 191, 36, 0.3))",
                }}
              />
            </div>
          )}
          <div
            className="absolute inset-0 opacity-0 transition-all duration-300 group-hover:opacity-100 pointer-events-none"
            style={{
              boxShadow:
                "inset 0 20px 40px #fbbf24, inset 0 -20px 40px #d97706",
            }}
          />
          <div className="relative z-10 w-full p-4">
            <h3 className="text-lg font-bold text-white drop-shadow-md truncate">
              {name}
            </h3>
            <p className="text-sm text-white/90 mt-1">{photoCount} photos</p>
          </div>
        </div>
      </div>
    </div>
  );
}
