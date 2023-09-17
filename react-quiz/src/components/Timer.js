import{ useEffect } from 'react'

export default function Timer({dispatch, secondRemaining}) {
    const mins = Math.floor(secondRemaining / 60)
    const secs = secondRemaining % 60
    useEffect(
        function(){
            const id = setInterval(
                function(){
                    secondRemaining > 0 ? dispatch({type:'tick'}) : dispatch({type:"finish"})
                    console.log(secondRemaining);
                }, 1000
            );
            return () => clearInterval(id);
        },
        [dispatch, secondRemaining]
    )
  return (
    <div className='timer'>
    {mins < 10 && '0'}
    {mins}
    :
    {secs < 10 && '0'}
    {secs}
    </div>
  )
}
