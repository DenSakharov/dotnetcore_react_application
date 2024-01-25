import { useState } from 'react';
import OrdersPage from './OrdersPage'

import './Home.css'

export function Home() {
    const [view, setView] = useState(false);

    const click_view_table = (e: any) => {
        if(view)
            setView(false)
        else
            setView(true)
    }
    return (
        <div>
            <button className="styled-button"
                title="Показать таблицу" onClick={click_view_table} >Показать таблицу</button>
            <div>
                {view &&
                    <OrdersPage />}
            </div>
        </div>
    );
}
