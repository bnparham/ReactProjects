const ShowDate = ({addCount, date}) =>
{
  return(
    <div>
    <span>
      {addCount === 0
        ? "today is"
        : addCount >= 0
        ? `${addCount} days from today is `
        : `${Math.abs(addCount)} days ago is `}
    </span>
    <span> {date.toDateString()} </span>
  </div>
  )
}
export default ShowDate