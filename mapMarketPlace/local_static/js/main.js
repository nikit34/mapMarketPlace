var MM;
var OC;


window.onload = () => {
    if(window.location.href.indexOf('main') > -1 &&
    window.location.href.indexOf('next=/main') < 0) {
        const NUM_COL = 20;
        const NUM_ROW = 20;

        window.customElements.define('card-map', Card);

        const size_root = generateElems(NUM_COL, NUM_ROW);

        MM = new MoveMap();
        MM.event_listens();

        OC = new OpenCard(size_root);
        OC.event_listens();
    }
}

function generateElems(NUM_COL, NUM_ROW){
    const elem_root = document.getElementById('root');
    const size_root = {
        x: parseInt(window.getComputedStyle(elem_root, 'div').getPropertyValue('height')),
        y: parseInt(window.getComputedStyle(elem_root, 'div').getPropertyValue('width'))
    }
    const set_size_elem = {
        x: parseInt(size_root.x / NUM_COL),
        y: parseInt(size_root.y / NUM_ROW)
    };
    let set_coord, set_bg, set_text;
    for(let i = 0; i < NUM_ROW - 0.5; i += 0.5){
        for(let j = 0; j < NUM_COL - 0.5; j += 0.5){
            if (Number.isInteger(i) && Number.isInteger(j) ||
                !Number.isInteger(i) && !Number.isInteger(j)) {
                set_coord = {x: set_size_elem.x * j, y: set_size_elem.y * i };
                set_bg = 'url("../static/logo.png")';
                set_text = `card_${i}_${j}`; // TODO: get from db -> text, bg
                card = new Card(set_size_elem, set_coord, set_bg, set_text);
                if (card.default_state()) {
                    console.log('default state -> generated text dont visable');
                    // card.display_input_form();
                } else {
                    console.log('custom state');
                    card.display_text();
                }
                card.event_listens();
                elem_root.appendChild(card);
                card.build_static_style();
                card.setAttribute('id', `card_${i}_${j}`);
            }
        }
    }
    return size_root;
}

class Card extends HTMLElement {
    constructor(set_size_elem, set_coord, set_bg, set_text = ''){
        super();
        this.set_size_elem = {};
        for (var key in set_size_elem) {
            this.set_size_elem[key] = set_size_elem[key];
        }
        this.set_coord = {};
        for (var key in set_coord) {
            this.set_coord[key] = set_coord[key];
        }
        this.set_bg = set_bg;
        this.set_text = set_text;
        this.build_define_style();
    }

    build_define_style() {
        this.style.width = this.set_size_elem.x + 'px';
        this.style.height = this.set_size_elem.y + 'px';
        this.style.fontSize = this.set_size_elem.x / 10 + 'px';
        this.style.left = this.set_coord.x + 'px';
        this.style.top = this.set_coord.y + 'px';
        this.style.background = this.set_bg;
    }

    build_static_style(){
        this.setAttribute('class', 'card');
    }

    display_text() {
        let text_elem = document.createElement('p');
        text_elem.textContent = this.set_text;
        this.appendChild(text_elem);
    }

    display_input_form() {
        // le
        return;
    }

    default_state(){
        if (this.set_text.substring(0, 5) === 'card_') {
            return true;
        }
        return false;
    }

    event_listens(){
        this.addEventListener('mouseover', () => {
            this.style.boxShadow = `inset 0 0 ${parseInt(this.set_size_elem.x * 10) + 'px'} ${parseInt(this.set_size_elem.x / 10) + 'px'} rgba(0,0,0,0.8)`;
            this.style.color = 'white';
        });
        this.addEventListener('mouseout', () => {
            this.style.boxShadow = 'none';
            this.style.color = 'rgba(0,0,0,0)';
        });
    }
}


//     <p><input type="file"  accept="image/*" name="image" id="file"  onchange="loadFile(event)" style="display: none;"></p>
// <p><label for="file" style="cursor: pointer;">Upload Image</label></p>
// <p><img id="output" width="200" /></p>

// <script>
// var loadFile = function(event) {
// 	var image = document.getElementById('output');
// 	image.src = URL.createObjectURL(event.target.files[0]);
// };
// </script>


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

    event_listens(){
        document.body,addEventListener('click', (e) => {
            if((e.target.id).toString().substring(0, 5) === 'card_' &&
                Object.keys(this.toggle).every((k) => !this.toggle[k])
            ) {
                this.toggle.set_start = true;
                MM.set_toggle_move_map = false;
                this.click_card = e.target;
                this.click_card.setAttribute('class', 'card animate');
                this.click_card.style.width = parseInt(this.click_card.style.width) * 5 + 'px';
                this.click_card.style.height = parseInt(this.click_card.style.height) * 5 + 'px';
                this.click_card.style.zIndex = '12';
                this.prev_style_card_top = this.click_card.style.top;
                this.prev_style_card_left = this.click_card.style.left;
                this.click_card.style.top = document.documentElement.scrollTop + (window.innerHeight - parseInt(this.click_card.style.height)) / 2 + 'px';
                this.click_card.style.left = document.documentElement.scrollLeft + (window.innerWidth - parseInt(this.click_card.style.width)) / 2 + 'px';
                this.black_blind = document.createElement('div');
                this.black_blind.setAttribute('class', 'overlay');
                this.black_blind.style.width = this.size_root.x + 40 + 'px';
                this.black_blind.style.height = this.size_root.y + 20 + 'px';
                setTimeout(() => {
                    this.click_card.removeAttribute('class');
                    this.click_card.setAttribute('class', 'card');
                    this.toggle.set_end = true;
                }, 1500);
                this.click_card.before(this.black_blind);

            } else if (this.toggle.start && this.toggle.end) {
                this.toggle.set_start = false;
                MM.set_toggle_move_map = true;
                this.click_card.removeAttribute('class');
                this.click_card.setAttribute('class', 'card animate');
                this.click_card.style.top = this.prev_style_card_top;
                this.click_card.style.left = this.prev_style_card_left;
                this.click_card.style.width = parseInt(parseInt(this.click_card.style.width) / 5) + 'px';
                this.click_card.style.height = parseInt(parseInt(this.click_card.style.height) / 5) + 'px';
                setTimeout(() => {
                    this.click_card.style.zIndex = '1';
                    this.click_card.removeAttribute('class');
                    this.click_card.setAttribute('class', 'card');
                    this.black_blind.remove();
                    this.toggle.set_end = false;
                }, 1500);
            }
        })
    }
}
