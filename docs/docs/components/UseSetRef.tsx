import { useSetRef } from '@lightvis/hooks';
import { useEffect } from 'react';

export function Demo1() {
    const { element, setRef } = useSetRef(() => {
        console.log(element);
    });

    useEffect(() => {
        console.log("gege");
    }, []);

    return <div ref={setRef}>test</div>
}