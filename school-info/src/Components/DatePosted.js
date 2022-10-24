import React from 'react'

function DatePosted(props) {
    const current = new Date();
    const time = current.getTime();
    // const month = current.getMonth();
    // const year = current.getFullYear();
    // const hour = current.getHours();
    // const min = current.getMinutes();
    const contentDate = props.content.values.createdAt.toDate();
    const timeDifference = (time - contentDate.getTime()) / 1000;

    return (
        <div className='time-ago'>
            {timeDifference > 31536000 ?
                <div>
                    {Math.floor(timeDifference / 31536000)}y ago
                </div> :
                timeDifference > 2628288 ?
                    <div>
                        {Math.floor(timeDifference / 2628288)}mth ago
                    </div> :
                    timeDifference > 86400 ?
                        <div>
                            {Math.floor(timeDifference / 86400)}d ago
                        </div> :
                        timeDifference > 3600 ?
                            <div>
                                {Math.floor(timeDifference / 3600)}hr ago
                            </div> :
                            timeDifference > 60 ?
                                <div>
                                    {Math.floor(timeDifference / 60)}min ago
                                </div> :
                                <div>
                                    {Math.floor(timeDifference)}s
                                </div>
            }
        </div>
    )
}

export default DatePosted