import { Component, effect, ElementRef, input, linkedSignal, output, signal, ViewChild } from '@angular/core';


@Component({
  selector: 'country-search-input',
  imports: [],
  templateUrl: './search-input.html',
})
export class SearchInput {
  @ViewChild('txtSearch') txtSearch!: ElementRef<HTMLInputElement>;

  placeholder = input('Buscar');
  debounceTime = input(2000);
  initialValue = input<string>();

  value = output<string>();
  isLoading = input(false);

  inputValue= linkedSignal<string>(() => this.initialValue() ?? '');

  //Debounce effect example: va a retrasar la emision del valor
  // hasta que el usuario deje de escribir por un tiempo determinado
  debounceEffect = effect( (onCleanup) => {
    const value = this.inputValue(); //cuando angular detecta un cambio en inputValue se ejecuta el efecto

    const timeout = setTimeout(() => {
      this.value.emit(value)
    },this.debounceTime()); //tiempo de espera dado por una señal

    onCleanup(() => { //cuando el efecto se vuelve a ejecutar, limpia el timeout anterior
      clearTimeout(timeout);
    });
  });

  focusEffect = effect( () => {
    if(!this.isLoading()) {
      setTimeout(() => {
        this.txtSearch.nativeElement.focus()
      }, 0);
    }
  });

}

