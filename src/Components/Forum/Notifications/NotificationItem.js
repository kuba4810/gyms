import React from 'react'
import {Link} from 'react-router-dom'


class NotificationItem extends React.Component{

    render(){
        var ntfData = this.props.ntfData;


        return(
            <div>
                <div className={`alert alert-${ntfData.ntf_type} alert-dismissible animated fadeInDown`} style={{animationDelay:`.${this.props.delay}s`}}>
                    <button type="button" class="close" data-dismiss="alert">&times;</button>
                    {ntfData.ntf_text} {ntfData.ntf_link !=null ? <Link to={`${ntfData.ntf_link}`} style={{color:"green !important;"}} > Link </Link> : ""}
                </div>
            </div>
        );
    }
}

export default NotificationItem;