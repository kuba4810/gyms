import React from 'react'
import {Link} from 'react-router-dom'
import {notification_read} from '../../../services/API/notifications';


class NotificationItem extends React.Component{


    notificationRead = async () => {
        notification_read(this.props.ntfData.ntf_id);
    }

    render(){
        var ntfData = this.props.ntfData;


        return(
            <div>
                <div className={`alert alert-${ntfData.ntf_type} alert-dismissible animated fadeInDown`} style={{animationDelay:`.${this.props.delay}s`}}>
                    <button type="button" class="close" data-dismiss="alert" onClick={this.notificationRead}>&times;</button>
                    {ntfData.ntf_text} {ntfData.ntf_link !=null ? <Link to={`${ntfData.ntf_link}`} style={{color:"green !important;"}} > Przejdź </Link> : ""}
                </div>
            </div>
        );
    }
}

export default NotificationItem;