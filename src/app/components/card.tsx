interface CardProps {
    title: string;
    imageUrl: string;
    description: string;
}

export default function Card({title, imageUrl, description}: CardProps) {
  return (
    <div className="card bg-base-100 w-96 shadow-sm">
        <figure>
            <img src={imageUrl} alt={title} className="h-[280px] mt-5"/>
        </figure>
        <div className="card-body">
            <h2 className="card-title">{title}</h2>
            <p>{description}</p>
            {/* <div className="card-actions justify-end">
            <button className="btn btn-primary">Buy Now</button>
            </div> */}
        </div>
    </div>
  );
}
