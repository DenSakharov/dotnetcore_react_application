import { useState } from 'react';
import OrdersPage from './OrdersPage'

import '../../styles/Home.css'

export function Home() {
    const [view, setView] = useState(true);

    const click_view_table = (e: any) => {
        if(view)
            setView(false)
        else
            setView(true)
    }
    return (
        <div>
            <button className="styled-button"
                title={view ? "Скрыть таблицу" : "Показать таблицу"} onClick={click_view_table} >
                {view ? "Скрыть таблицу" : "Показать таблицу"}
            </button>
            <div>
                {view &&
                    <OrdersPage />}
            </div>
        </div>
    );
}
