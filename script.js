// [추가] 사운드 이펙트 훅
const useSound = (volume = 0.5) => {
  const playHover = () => {
    // 실제로는 여기에 짧은 '틱' 소리 파일 재생 (예: new Audio('/hover.mp3').play())
    // 현재는 콘솔로 대체하거나 무음 처리 (브라우저 정책상 자동 재생 제한 때문)
  };
  const playClick = () => {
    // '찰칵' 하는 기계음
  };
  return { playHover, playClick };
};
// ==========================================
// [UPDATED] WEBTOON VIEWER COMPONENT
// ==========================================
function WebtoonViewer({ episode, comicData, onClose, theme }) { // theme prop 추가됨
    const [isUIHidden, setIsUIHidden] = useState(false);
    const [showChapterList, setShowChapterList] = useState(false); // [추가] 회차 목록 사이드바 상태
    const [progress, setProgress] = useState(0);
    const viewerRef = useRef(null);
    const [activePin, setActivePin] = useState(null);
    
    // [추가] 댓글 상태 관리
    const [inputComment, setInputComment] = useState("");
    const [localComments, setLocalComments] = useState(comicData?.comments || []);

    const handleScroll = () => {
        if (!viewerRef.current) return;
        const totalHeight = viewerRef.current.scrollHeight - window.innerHeight;
        const currentScroll = viewerRef.current.scrollTop;
        setProgress((currentScroll / totalHeight) * 100);
    };

    // [추가] 댓글 등록 함수
    const handleAddComment = (e) => {
        if (e.key === 'Enter' && inputComment.trim()) {
            const newComment = { user: "Me", text: inputComment, likes: "0" };
            setLocalComments([newComment, ...localComments]);
            setInputComment("");
            // 여기에 핀 추가 로직도 연결 가능
        }
    };

    const toggleUI = () => setIsUIHidden(!isUIHidden);

    // ... (기존 이미지/핀 데이터 로직은 동일) ...
    const images = comicData?.viewerImages || []; 
    const webtoonImages = [...images, ...images]; 
    const pinsData = comicData?.pins || [];

    return (
        <div className="fixed inset-0 z-[9999] bg-black text-white flex flex-col cursor-auto font-kr selection:bg-[var(--theme-color)] selection:text-black">
            
            {/* [추가] 왼쪽 회차 목록 사이드바 (Overlay) */}
            <div className={`fixed inset-y-0 left-0 w-64 bg-[#111] border-r border-white/10 z-[70] transform transition-transform duration-300 ${showChapterList ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="p-4 border-b border-white/10 flex justify-between items-center">
                    <h3 className="font-bold text-white">EPISODES</h3>
                    <button onClick={() => setShowChapterList(false)}><X size={18} className="text-gray-500 hover:text-white"/></button>
                </div>
                <div className="overflow-y-auto h-full pb-20">
                    {[...Array(20)].map((_, i) => (
                        <div key={i} className="p-3 border-b border-white/5 hover:bg-white/5 cursor-pointer flex justify-between group">
                            <span className={`text-xs ${i === 0 ? 'text-[var(--theme-color)] font-bold' : 'text-gray-400 group-hover:text-white'}`}>Ep. {364-i}</span>
                            <span className="text-[10px] text-gray-600">24.03.15</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Top Bar */}
            <div className={`fixed top-0 left-0 w-full bg-black/90 backdrop-blur-md border-b border-white/10 p-4 flex items-center justify-between transition-transform duration-300 z-50 ${isUIHidden ? '-translate-y-full' : 'translate-y-0'}`}>
                <div className="flex items-center gap-4">
                    <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full"><ChevronLeft size={24}/></button>
                    <button onClick={() => setShowChapterList(!showChapterList)} className="p-2 hover:bg-white/10 rounded text-gray-400 hover:text-white flex items-center gap-2">
                        <ListMusic size={20}/> <span className="text-xs font-cyber hidden md:inline">LIST</span>
                    </button>
                </div>
                <div className="text-center">
                    <h3 className="text-sm font-bold text-white">{comicData?.title || "EPISODE"}</h3>
                    <p className="text-[10px] text-gray-500">Ep. {episode?.ep || "1"}</p>
                </div>
                <div className="w-16 flex justify-end gap-2">
                    <button className="p-2 hover:text-[var(--theme-color)]"><Bookmark size={20}/></button>
                </div>
            </div>

            {/* Progress Bar */}
            <div className="fixed top-0 left-0 w-full h-1 bg-gray-800 z-[60]">
                <div className="h-full bg-[var(--theme-color)] transition-all duration-100 shadow-[0_0_10px_var(--theme-glow)]" style={{ width: `${progress}%` }}></div>
            </div>

            {/* Main Viewer Area */}
            <div ref={viewerRef} onScroll={handleScroll} onClick={() => { toggleUI(); setShowChapterList(false); }} className="flex-1 overflow-y-auto hide-scrollbar w-full max-w-3xl mx-auto bg-[#111] pb-32 relative shadow-2xl">
                {webtoonImages.map((src, i) => (
                    <div key={i} className="relative group/cut">
                        <img src={src} className="w-full block select-none" alt={`cut-${i}`} />
                        
                        {/* [UI] 이미지 위에 마우스 올리면 + 버튼 표시 (핀 추가 유도) */}
                        <div className="absolute top-4 right-4 opacity-0 group-hover/cut:opacity-100 transition-opacity">
                            <button className="bg-black/50 hover:bg-[var(--theme-color)] text-white hover:text-black p-2 rounded-full backdrop-blur-md transition-colors">
                                <Plus size={16}/>
                            </button>
                        </div>

                        {/* Existing Pins Logic */}
                        {pinsData.filter(pin => pin.imageIndex === i).map((pin, pinIndex) => (
                             <div key={pinIndex} className="absolute z-50" style={{ left: `${pin.x}%`, top: `${pin.y}%` }}>
                                {/* ... (기존 핀 렌더링 코드 유지) ... */}
                                <div className="relative -translate-x-1/2 -translate-y-1/2 cursor-pointer group" onClick={(e) => { e.stopPropagation(); setActivePin(activePin === pin ? null : pin); }}>
                                    <div className="absolute inset-0 bg-[var(--theme-color)] rounded-full blur-md opacity-60 animate-ping"></div>
                                    <div className="relative w-4 h-4 bg-[var(--theme-color)] rounded-full shadow-[0_0_15px_var(--theme-glow)] border-2 border-white/80 hover:scale-125 transition-transform duration-300"></div>
                                </div>
                                {/* ... (기존 핀 팝업 코드 유지, 단 activePin 상태 연결 확인) ... */}
                             </div>
                        ))}
                    </div>
                ))}

                {/* [UPDATED] Bottom Area: 댓글 & 다음화 */}
                <div className="p-8 md:p-16 bg-black relative z-10 space-y-12">
                     {/* 작가의 말 */}
                    <div className="border-l-4 border-[var(--theme-color)] pl-4 py-2 bg-[#111]">
                        <p className="text-gray-300 text-sm font-museum">"이번 화는 특히 그리피스의 감정선에 집중했습니다."</p>
                        <p className="text-gray-600 text-xs mt-1">- 작가 Kentaro Miura -</p>
                    </div>

                    {/* 댓글 섹션 */}
                    <div>
                        <h4 className="text-lg font-bold mb-6 flex items-center gap-2">COMMENTS <span className="text-[var(--theme-color)] text-sm">{localComments.length}</span></h4>
                        
                        {/* 댓글 입력창 */}
                        <div className="flex gap-4 mb-8">
                            <div className="w-10 h-10 rounded-full bg-gray-800 shrink-0 overflow-hidden"><img src="https://pngimg.com/uploads/knight/knight_PNG57.png" className="w-full h-full object-cover"/></div>
                            <div className="flex-1 relative">
                                <input 
                                    type="text" 
                                    value={inputComment}
                                    onChange={(e) => setInputComment(e.target.value)}
                                    onKeyDown={handleAddComment}
                                    placeholder="Add a comment... (Press Enter)" 
                                    className="w-full bg-transparent border-b border-white/20 py-2 px-1 text-sm focus:outline-none focus:border-[var(--theme-color)] transition-colors placeholder-gray-600" 
                                />
                            </div>
                        </div>

                        {/* 댓글 리스트 */}
                        <div className="space-y-6">
                            {localComments.map((c, idx) => (
                                <div key={idx} className="flex gap-4 group">
                                    <div className="w-8 h-8 rounded-full bg-gray-800 shrink-0 overflow-hidden opacity-70 group-hover:opacity-100 transition-opacity">
                                        <img src={`https://source.unsplash.com/random/100x100?sig=${idx}`} className="w-full h-full object-cover"/>
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-baseline gap-2 mb-1">
                                            <span className="text-xs font-bold text-gray-300 group-hover:text-[var(--theme-color)] transition-colors">{c.user}</span>
                                            <span className="text-[10px] text-gray-600">Just now</span>
                                        </div>
                                        <p className="text-xs text-gray-400 leading-relaxed">{c.text}</p>
                                        <div className="flex items-center gap-3 mt-2 text-[10px] text-gray-600">
                                            <button className="hover:text-white flex items-center gap-1"><ThumbsUp size={10}/> {c.likes}</button>
                                            <button className="hover:text-white">Reply</button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Next Button */}
                    <button className="w-full py-5 bg-[var(--theme-color)] text-black font-bold text-lg rounded-sm hover:opacity-90 transition-all hover:tracking-widest duration-300 shadow-[0_0_20px_var(--theme-glow)]">
                        NEXT EPISODE
                    </button>
                </div>
            </div>

            {/* Bottom Floating Bar */}
            <div className={`fixed bottom-0 left-0 w-full bg-black/90 backdrop-blur-md border-t border-white/10 p-4 transition-transform duration-300 z-50 ${isUIHidden ? 'translate-y-full' : 'translate-y-0'}`}>
                {/* ... (기존 하단 바 코드 유지) ... */}
                 <div className="max-w-3xl mx-auto flex justify-between items-center">
                    <div className="flex gap-4">
                        <button className="flex flex-col items-center gap-1 text-gray-400 hover:text-[var(--theme-color)] transition-colors"><Heart size={20} /><span className="text-[10px]">9.8k</span></button>
                        <button className="flex flex-col items-center gap-1 text-gray-400 hover:text-white transition-colors"><MessageCircle size={20} /><span className="text-[10px]">{localComments.length}</span></button>
                    </div>
                    <div className="flex gap-2">
                        <button className="px-4 py-2 border border-white/20 rounded text-xs hover:bg-white/10 transition-colors">Prev</button>
                        <button className="px-4 py-2 border border-white/20 rounded text-xs hover:bg-white/10 transition-colors">Next</button>
                    </div>
                    <button className="flex flex-col items-center gap-1 text-gray-400 hover:text-white transition-colors"><Share size={20} /><span className="text-[10px] font-cyber">SHARE</span></button>
                </div>
            </div>
        </div>
    );
}
// [추가] 뱃지 데이터 (ProfileView 안에 선언)
const badges = [
    { id: 1, name: "NIGHT WALKER", icon: "🌙", desc: "Read 10 episodes after midnight", unlocked: true },
    { id: 2, name: "FIRST BLOOD", icon: "🩸", desc: "Left your first comment", unlocked: true },
    { id: 3, name: "COLLECTOR", icon: "💎", desc: "Saved 50 scraps", unlocked: false },
    { id: 4, name: "BERSERKER", icon: "⚔️", desc: "Finished reading 'Berserk'", unlocked: true },
    { id: 5, name: "NETRUNNER", icon: "🌐", desc: "Changed theme 5 times", unlocked: false },
];

// ProfileView의 JSX 리턴 부분 중, 적절한 위치(예: 하단 그리드)에 추가하세요.
<section className="mt-8">
    <div className="flex items-center gap-2 mb-4">
        <Star size={14} className="text-[var(--theme-color)]"/>
        <h3 className="font-cyber text-xs tracking-widest text-gray-300">ACHIEVEMENTS</h3>
    </div>
    <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {badges.map((badge) => (
            <div key={badge.id} className={`group relative p-3 rounded-lg border ${badge.unlocked ? 'bg-white/5 border-white/10 hover:border-[var(--theme-color)]' : 'bg-black border-white/5 opacity-50'} transition-all cursor-default`}>
                <div className="flex flex-col items-center text-center gap-2">
                    <div className={`text-2xl ${badge.unlocked ? 'grayscale-0' : 'grayscale'}`}>{badge.icon}</div>
                    <span className={`text-[9px] font-bold font-cyber ${badge.unlocked ? 'text-white' : 'text-gray-600'}`}>{badge.name}</span>
                </div>
                {/* Tooltip */}
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-32 bg-black border border-white/20 p-2 rounded text-[10px] text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 text-center">
                    {badge.desc}
                    {!badge.unlocked && <div className="text-[var(--theme-color)] mt-1">LOCKED</div>}
                </div>
            </div>
        ))}
    </div>
</section>