const announcements = [
  { company: "SIIC", color: "bg-green-600", message: "Interviews are now commencing!" },
  { company: "Rootcode", color: "bg-yellow-500", message: "Status Update : Interviews are on Hold" },
  { company: "MAS", color: "bg-red-500", message: "Status Update : Interviews are on Hold" },
  { company: "Sysco", color: "bg-blue-500", message: "Status Update : Interviews are on Hold" },
  { company: "SIIC", color: "bg-green-600", message: "Lunch Break from 12.00 - 1.00" }
];

function Announcement(){
    return(
    <div className="w-80 h-90 rounded-md bg-slate-200 p-2 relative">
      <h2 className="text-center text-black text-xl font-semibold leading-tight mb-2">Announcements</h2>
      <div className="flex flex-col gap-2 overflow-y-auto max-h-[300px] pr-1">
        {announcements.map((item, index) => (
          <div key={index} className="bg-slate-100/80 rounded-md border-b border-border flex justify-between items-start p-3">
            <div className="flex items-center gap-2.5">
              <div className={`${item.color} px-2.5 py-0.5 rounded-md text-xs font-semibold text-white`}>
                {item.company}
              </div>
              <p className="text-sm font-medium text-foreground">{item.message}</p>
            </div>
            <div className="p-2 bg-border rounded-md flex flex-col justify-center items-center gap-1">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="w-1 h-1 bg-foreground rounded-full" />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}


export default Announcement