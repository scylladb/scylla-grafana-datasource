import { Field } from '../types';
export default function attachEventListeners({ field, handleChange, isRadioOrCheckbox, }: {
    field: Field;
    isRadioOrCheckbox: boolean;
    handleChange?: EventListenerOrEventListenerObject;
}): void;
