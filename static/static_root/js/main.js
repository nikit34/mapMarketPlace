import { getCookie, sleep } from './base.js';

var MM;
var OC;


window.onload = () => {
    if(window.location.href.indexOf('main') > -1 &&
    window.location.href.indexOf('next=/main') < 0) {
        const NUM_COL = 20;
        const NUM_ROW = 20;

        window.customElements.define('card-map', Card);

        generateElems(NUM_COL, NUM_ROW);
    }
}

async function generateElems(NUM_COL, NUM_ROW){
    const elem_root = document.getElementById('root');
    const size_root = {
        x: parseInt(window.getComputedStyle(elem_root, 'div').getPropertyValue('height')),
        y: parseInt(window.getComputedStyle(elem_root, 'div').getPropertyValue('width'))
    }
    window.scrollTo( parseInt(size_root.x / 2) - 400, parseInt(size_root.y / 2) );
    const set_size_elem = {
        x: parseInt(size_root.x / NUM_COL),
        y: parseInt(size_root.y / NUM_ROW)
    };
    let card, set_coord, generated_id;
    await sleep(500);
    let saved_cards = JSON.parse(JSON.parse(document.getElementById('js-cards').textContent));
    let saved_card_fields;
    for(let i = 0; i < NUM_COL - 0.5; i += 0.5){
        for(let j = 0; j < NUM_ROW - 0.5; j += 0.5){
            if (Number.isInteger(i) && Number.isInteger(j) ||
                !Number.isInteger(i) && !Number.isInteger(j)) {
                set_coord = {x: set_size_elem.x * j, y: set_size_elem.y * i };
                generated_id = `card_${i}_${j}`;
                card = new Card(set_size_elem, set_coord);
                for(let saved_card_index = 0; saved_card_index < saved_cards.length; saved_card_index++){
                    saved_card_fields = saved_cards[saved_card_index].fields;
                    if (generated_id === saved_card_fields.card_id){
                        card.display_ads_image(saved_card_fields.image);
                        card.display_ads_title(saved_card_fields.title);
                        card.author = saved_card_fields.author;
                        card.buffer_description = saved_card_fields.description;
                        break;
                    }
                    if(saved_card_index === saved_cards.length) {
                        card.display_curtain(true);
                    }
                }
                card.event_listens();
                card.setAttribute('id', `card_${i}_${j}`);
                elem_root.appendChild(card);
            }
        }
    }
    MM = new MoveMap();
    MM.event_listens();

    OC = new OpenCard(size_root);
    OC.event_listens();
}

class Card extends HTMLElement {
    constructor(set_size_elem, set_coord){
        super();
        this.set_size_elem = {};
        for (var key in set_size_elem) {
            this.set_size_elem[key] = set_size_elem[key];
        }
        this.set_coord = {};
        for (var key in set_coord) {
            this.set_coord[key] = set_coord[key];
        }
        this.build_define_style();
        this.author = null;

        this.form = null;
        this.set_title = null;
        this.set_description = null;
        this.buffer_description = null;
        this.curtain_text = null;
    }

    build_define_style() {
        this.style.width = this.set_size_elem.x + 'px';
        this.style.height = this.set_size_elem.y + 'px';
        this.style.fontSize = this.set_size_elem.x / 10 + 'px';
        this.style.left = this.set_coord.x + 'px';
        this.style.top = this.set_coord.y + 'px';
        this.style.background = 'url("../static/bg_card.jpg")';
        this.style.color = 'rgba(0,0,0,0)';
        this.setAttribute('class', 'card');
    }

    check_auth(auth) {
        if(!!auth){
            return auth === this.author ? true : false;
        } else {
            return false;
        }
    }

    display_ads_title(set_title) {
        if(!!set_title){
            this.set_title = document.createElement('p');
            this.set_title.setAttribute('class', 'ads_title');
            this.set_title.textContent = set_title;
            this.set_title.style.zIndex = parseInt(this.style.zIndex) + 1;
            this.appendChild(this.set_title);
        } else if(!!this.set_title) {
            this.set_title.remove();
        }
    }

    display_ads_description(buffer_description){
        if(!!buffer_description){
            this.set_description = document.createElement('p');
            this.set_description.setAttribute('class', 'ads_description');
            this.set_description.textContent = buffer_description;
            this.set_description.style.zIndex = parseInt(this.style.zIndex) + 1;
            this.appendChild(this.set_description);
        } else if(!!this.set_description) {
            this.set_description.remove();
        }
    }

    display_ads_image(set_bg) {
        this.style.background = "url('/media/" + set_bg + "')";
    }

    display_curtain(enable){
        if(enable){
            this.build_define_style();
            this.curtain_text = document.createElement('p');
            this.curtain_text.setAttribute('class', 'curtain');
            this.curtain_text.textContent = "Not occupied";
            this.curtain_text.style.zIndex = parseInt(this.style.zIndex) + 1;
            this.appendChild(this.curtain_text);
        } else if(!!this.curtain_text) {
            this.curtain_text.remove();
        }
    }

    display_input_form(enable) {
        if(enable){
            this.form = document.createElement('form');
            this.form.setAttribute('action', location.href);
            this.form.setAttribute('method', 'POST');
            this.form.setAttribute('enctype', 'multipart/form-data');
            this.form.style.marginTop = parseInt(this.style.height) / 2 - 150 + 'px';
            this.form.style.marginLeft = parseInt(this.style.width) / 2 - 150 + 'px';
            this.form.style.marginRight = parseInt(this.style.width) / 2 - 150 + 'px';
            this.form.style.zIndex = parseInt(this.style.zIndex) + 1;
            this.appendChild(this.form);
            let wraper = document.createElement('h3');
            wraper.textContent = "Place Your ADS";
            this.form.appendChild(wraper);
                let elem = document.createElement('input');
                elem.setAttribute('type', 'hidden');
                elem.setAttribute('name', 'csrfmiddlewaretoken');
                elem.setAttribute('value', getCookie('csrftoken'));
            this.form.appendChild(elem);

                wraper = document.createElement('p');
                    elem = document.createElement('label');
                    elem.setAttribute('for', 'id_title');
                    elem.textContent = 'Title: ';
                wraper.appendChild(elem);
                    elem = document.createElement('input');
                    elem.setAttribute('id', 'id_title');
                    elem.setAttribute('type', 'text');
                    elem.setAttribute('name', 'title');
                    elem.setAttribute('maxlength', '50');
                    elem.required = true;
                wraper.appendChild(elem);
            this.form.appendChild(wraper);

                wraper = document.createElement('p');
                    elem = document.createElement('label');
                    elem.setAttribute('for', 'id_description');
                    elem.textContent = 'Description: ';
                wraper.appendChild(elem);
                    elem = document.createElement('input');
                    elem.setAttribute('id', 'id_description');
                    elem.setAttribute('type', 'text');
                    elem.setAttribute('name', 'description');
                    elem.setAttribute('maxlength', '200');
                    elem.required = false;
                wraper.appendChild(elem);
            this.form.appendChild(wraper);

                wraper = document.createElement('p');
                    elem = document.createElement('label');
                    elem.setAttribute('for', 'id_image');
                    elem.textContent = 'Image Upload';
                wraper.appendChild(elem);
                    elem = document.createElement('input');
                    elem.style.maxWidth = '175px';
                    elem.setAttribute('id', 'id_image');
                    elem.setAttribute('type', 'file');
                    elem.setAttribute('name', 'image');
                    elem.required = true;
                wraper.appendChild(elem);
            this.form.appendChild(wraper);

                wraper = document.createElement('p');
                    elem = document.createElement('label');
                    elem.setAttribute('for', 'id_timer');
                    elem.textContent = 'Timer: ';
                wraper.appendChild(elem);
                    elem = document.createElement('input');
                    elem.setAttribute('id', 'id_timer');
                    elem.setAttribute('type', 'text');
                    elem.setAttribute('name', 'timer');
                    elem.setAttribute('autocomplete', 'off');
                    elem.required = true;
                wraper.appendChild(elem);
            this.form.appendChild(wraper);
            $("#id_timer").datepicker({
                onSelect: function() {
                  $(this).change();
                }
            });

                elem = document.createElement('input');
                elem.setAttribute('type', 'hidden');
                elem.setAttribute('id', 'id_card_id');
                elem.setAttribute('name', 'card_id');
                elem.value = this.id;
            this.form.appendChild(elem);

                wraper = document.createElement('p');
                    elem = document.createElement('button');
                    elem.setAttribute('type', 'submit');
                    elem.textContent = 'upload';
                wraper.appendChild(elem);
            this.form.appendChild(wraper);
        } else if(!!this.form) {
            this.form.remove();
        }
    }

    event_listens(){
        this.addEventListener('mouseover', () => {
            this.style.boxShadow = `inset 0 0 ${parseInt(this.set_size_elem.x * 50) + 'px'} ${parseInt(this.set_size_elem.x) + 'px'} rgba(0,0,0,0.8)`;
            this.style.color = 'rgb(0,0,0)';
        });
        this.addEventListener('mouseout', () => {
            this.style.boxShadow = 'none';
            this.style.color = 'rgba(0,0,0,0)';
        });
    }
}

class MoveMap {
    constructor(){
        this.gestures = {x: 0, y: 0};
        this.start_position = {x: 0, y: 0};
        this.velocity = {x: 0, y: 0};
        this.is_move_down = false;
        this.timer = 0;
        this.toggle = true;
    }

    set set_toggle_move_map(toggle){
        this.toggle = toggle;
    }

    get current_velocity() {
        this.velocity.x = this.start_position.x - this.gestures.x;
        this.velocity.y = this.start_position.y - this.gestures.y;
    }

    event_listens() {
        document.body.addEventListener('mousemove', (e) => {
            if(this.toggle) {
                this.gestures.x = parseInt(e.pageX);
                this.gestures.y = parseInt(e.pageY);
                if (this.is_move_down) {
                    window.scrollBy(
                        this.start_position.x - this.gestures.x,
                        this.start_position.y - this.gestures.y
                    );
                    return false;
                }
            }
        });
        document.body.addEventListener('mousedown', () => {
            if(this.toggle) {
                this.start_position.x = this.gestures.x;
                this.start_position.y = this.gestures.y;
                this.is_move_down = true;
                this.timer = window.setTimeout(this.current_velocity, 50);
            }
        });
        document.body.addEventListener('mouseup', () => {
            if(this.toggle) {
                this.is_move_down = false;
                let distance = {x: 0, y: 0};
                let scrollToPosition = {x: 0, y: 0};
                if (this.velocity.x != 0 || this.velocity.y != 0) {
                    let body = document.getElementsByTagName("body")[0];
                    distance.x = this.velocity.x * 20;
                    distance.y = this.velocity.y * 20;
                    scrollToPosition.y = body.scrollTop + distance.y;
                    scrollToPosition.x = body.scrollLeft + distance.x;
                    body.animate({ scrollTop: scrollToPosition.y}, 1000);
                    body.animate({ scrollLeft: scrollToPosition.x}, 1000);
                    this.velocity = {x: 0, y: 0};
                }
                return false;
            }
        });
    }
}


class OpenCard {
    constructor(size_root) {
        this.size_root = size_root;
        this.black_blind = null;
        this.prev_style_card_top = null;
        this.prev_style_card_left = null;
        this.click_card = false;
        this.toggle = {
            start: false,
            end: false,
            set set_start(start) {
                this.start = start;
            },
            set set_end(end) {
                this.end = end;
            }
        };
    }

    startOpen(target){
        MM.set_toggle_move_map = false;
        this.click_card = target;
        this.click_card.display_curtain(false);
        this.click_card.display_ads_title(false);
        this.click_card.style.zIndex = '12';
        this.click_card.setAttribute('class', 'card animate');
    }

    moveOpen(){
        this.click_card.style.width = parseInt(this.click_card.style.width) * 5 + 'px';
        this.click_card.style.height = parseInt(this.click_card.style.height) * 5 + 'px';
        this.prev_style_card_top = this.click_card.style.top;
        this.prev_style_card_left = this.click_card.style.left;
        this.click_card.style.top = document.documentElement.scrollTop + (window.innerHeight - parseInt(this.click_card.style.height)) / 2 + 'px';
        this.click_card.style.left = document.documentElement.scrollLeft + (window.innerWidth - parseInt(this.click_card.style.width)) / 2 + 'px';
    }

    endOpen(is_auth){
        this.click_card.removeAttribute('class');
        this.click_card.setAttribute('class', 'card');
        this.click_card.before(this.black_blind);
        if((this.click_card.check_auth(is_auth) || this.click_card.author === null) && !this.click_card.buffer_description) {
            this.click_card.display_input_form(true);
        } else if(!!this.click_card.buffer_description){
            this.click_card.display_ads_description(this.click_card.buffer_description);
        }
    }

    startClose(is_auth){
        MM.set_toggle_move_map = true;
        if((this.click_card.check_auth(is_auth) || this.click_card.author === null) && !this.click_card.buffer_description){
            this.click_card.display_input_form(false);
        } else if(!!this.click_card.buffer_description){
            this.click_card.display_ads_description(false);
        }
        this.click_card.removeAttribute('class');
        this.click_card.setAttribute('class', 'card animate');
    }

    moveClose(){
        this.click_card.style.top = this.prev_style_card_top;
        this.click_card.style.left = this.prev_style_card_left;
        this.click_card.style.width = parseInt(parseInt(this.click_card.style.width) / 5) + 'px';
        this.click_card.style.height = parseInt(parseInt(this.click_card.style.height) / 5) + 'px';
    }

    endClose(){
        this.click_card.removeAttribute('class');
        this.click_card.setAttribute('class', 'card');
        this.click_card.style.zIndex = '1';
        if(!!this.click_card.set_title){
            this.click_card.display_ads_title(this.click_card.set_title.textContent);
        } else {
            this.click_card.display_curtain(true);
        }
    }

    toggleBlankBlind(enable){
        if(enable){
            this.black_blind = document.createElement('div');
            this.black_blind.setAttribute('id', 'overlay');
            this.black_blind.style.width = this.size_root.x + 40 + 'px';
            this.black_blind.style.height = this.size_root.y + 20 + 'px';
        } else {
            this.black_blind.remove();
        }
    }

    event_listens(){
        let is_auth = JSON.parse(document.getElementById('js-auth').textContent);
        document.body,addEventListener('dblclick', (e) => {
            if((e.target.id).toString().substring(0, 5) === 'card_' &&
                Object.keys(this.toggle).every((k) => !this.toggle[k])
            ) {
                this.toggle.set_start = true;
                this.startOpen(e.target);
                this.moveOpen();
                this.toggleBlankBlind(true);
                setTimeout(() => {
                    this.endOpen(is_auth);
                    this.toggle.set_end = true;
                }, 1500);

            } else if ((e.target.id).toString() === 'overlay' &&
                this.toggle.start && this.toggle.end
            ) {
                this.toggle.set_start = false;
                this.startClose(is_auth);
                this.moveClose();
                setTimeout(() => {
                    this.toggleBlankBlind(false);
                    this.endClose();
                    this.toggle.set_end = false;
                }, 1500);
            }
        })
    }
}
