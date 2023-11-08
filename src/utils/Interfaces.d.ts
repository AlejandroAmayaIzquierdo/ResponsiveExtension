import { WindowProps } from "../Components/FloatingWindow/Window";

declare namespace TYPES {
    interface WorkSpace {
        name: string;
        layout: WindowProps[];
    }
}
