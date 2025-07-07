/*
<div className="w-80 h-60 relative">
<div className="w-60 h-60 left-[45px] top-0 absolute bg-muted rounded-lg shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] outline outline-1 outline-offset-[-1px] outline-border inline-flex flex-col justify-start items-start">
<div className="self-stretch flex-1 p-6 flex flex-col justify-center items-center gap-4">
<div className="inline-flex justify-center items-center">
<div className="justify-start text-foreground text-4xl font-semibold font-['Inter'] leading-10">Companies</div>
</div>
</div>
</div>
<div className="w-8 h-8 px-3 left-[300px] top-[105px] absolute bg-background rounded-full outline outline-1 outline-offset-[-1px] outline-foreground inline-flex justify-center items-center gap-2.5">
<div className="w-4 h-4 relative overflow-hidden">
<div className="w-2.5 h-0 left-[3.33px] top-[8px] absolute outline outline-[1.50px] outline-offset-[-0.75px] outline-foreground" />
<div className="w-1 h-2.5 left-[8px] top-[3.33px] absolute outline outline-[1.50px] outline-offset-[-0.75px] outline-foreground" />
</div>
</div>
<div className="w-8 h-8 px-3 left-0 top-[105px] absolute bg-background rounded-full outline outline-1 outline-offset-[-1px] outline-foreground inline-flex justify-center items-center gap-2.5">
<div className="w-4 h-4 relative overflow-hidden">
<div className="w-2.5 h-0 left-[3.33px] top-[8px] absolute outline outline-[1.50px] outline-offset-[-0.75px] outline-foreground" />
<div className="w-1 h-2.5 left-[3.33px] top-[3.33px] absolute outline outline-[1.50px] outline-offset-[-0.75px] outline-foreground" />
</div>
</div>
</div>
 */

function Carousel(){
    return(
        <div className="w-80 h-60 relative flex items-center">
            <div className="w-60 h-60 absolute left-[45px] top-0 bg-muted rounded-lg shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] outline outline-1 outline-offset-[-1px] outline-border inline-flex flex-col justify-start items-start">
                <div className="self-stretch flex-1 p-6 flex flex-col justify-center items-center gap-4">
                    <div className="inline-flex justify-center items-center">
                        <div className="justify-start text-foreground text-4xl font-semibold font-['Inter'] leading-10">Companies</div>
                    </div>
                </div>
            </div>
            <div className="w-8 h-8 absolute left-[300px] rounded-full bg-white text-black flex items-center justify-center outline outline-2 outline-black-500 ">
                ➔
            </div>
            <div className="w-8 h-8 absolute left-0 rounded-full bg-white text-black flex items-center justify-center outline outline-2 outline-black-500 rotate-180 ">
                ➔
            </div>
            
        </div>
    )

}

export default Carousel