import { Directive } from '@angular/core';
import Swal, { SweetAlertOptions } from 'sweetalert2';

export function confirmableAlert(configOpt?: SweetAlertOptions) {
  const config: SweetAlertOptions = configOpt || {
    title: 'Are you sure?',
    html: 'Do you want to perform this action?',
    showDenyButton: true,
    confirmButtonText: 'Yes',
    denyButtonText: 'No',
    icon: 'question'
  };
  return (target: Object, propertyKey: string, descriptor: PropertyDescriptor) => {
    const originalMethod = descriptor.value;
    descriptor.value = async function () {
      console.log();
      const result = await Swal.fire(config);
      if (result.isConfirmed) {
        originalMethod.apply(this, ['something']);
        return result;
      }
    };
  };

}


