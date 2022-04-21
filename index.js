const canvas = document.querySelector("canvas")

const c = canvas.getContext("2d")

canvas.width = innerWidth   // window is referenced
canvas.height = innerHeight

const gravity = .5
// ============================================================================= char
class Player {
    constructor() {
        this.position = {
            x:        100,
            y:        100,
        }
        this.velocity = {
            x:        0,
            y:        0
        }

        this.width  = 30
        this.height = 30
    }

    draw() {
        c.fillStyle = 'red'
        c.fillRect(this.position.x, this.position.y, this.width, this.height)
    }

    update() {
        this.draw()
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y

        if (this.position.y + this.height + this.velocity.y <= canvas.height)
            this.velocity.y += gravity
        else this.velocity.y = 0
    }
}
// ============================================================================= platform
class Platform {
    constructor({x,y,width,height}) {
        this.position = {
            x,          // means x: x 
            y           // ditto
        }

        this.width = 200
        this.height = 20
    }

    draw() {
        c.fillStyle= 'blue'
        c.fillRect(this.position.x, this.position.y, this.width, this.height)
    }
}

// ========================================================================== Game objects

const player = new Player() // player
const platforms = [new Platform({x:200,y:200}
), new Platform({x:500,y:200})] // platform


// ============================================================================ controls
const keys = {
    right:   { pressed: false },
    left:    { pressed: false },
    up:      { pressed: false },
    down:    { pressed: false }
}

// ============================================================================= movement
function animate() {
    requestAnimationFrame(animate)
    c.clearRect(0,0,canvas.width,canvas.height)
    // ================== updating and drawing
    platforms.forEach(platform => {
        platform.draw()
    })
    player.update()

    // for left and right
    if (keys.right.pressed && player.position.x < 400) {
        player.velocity.x                       = 5
    }else if (keys.left.pressed&& player.position.x > 100) {
        player.velocity.x                       = -5
    }else { 
        player.velocity.x                       = 0
        if (keys.right.pressed) {
            platforms.forEach(platform => {
                platform.draw()
                platform.position.x                 -= 5
            })
        }
        else if (keys.left.pressed){
            platforms.forEach(platform => {
                platform.draw()
                platform.position.x                 += 5
            })
        }
    }

    // collision *** oh god this is ugly to see if you know how to make it better pls do tell
    platforms.forEach(platform => {
    if (
        player.position.y + player.height                           <= platform.position.y 
        && player.position.y + player.height + player.velocity.y    >= platform.position.y 
        && player.position.x + player.width                         >= platform.position.x 
        && player.position.x                                        <= platform.position.x +     platform.width) {
        player.velocity.y = 0
        }
    })
}

animate()

// ============================================================================= event listeners

/***
 * todo make no double jump xxx
 * todo make able jump free fall
 *
 */
addEventListener('keydown', ({ keyCode }) => {
    switch ( keyCode ) {
        case 65:
            keys.left.pressed = true 
            break;
        case 83:
            // keys.down.pressed = true 
            break;
        case 68:
            keys.right.pressed = true 
            break;
        case 87:
            if (player.velocity.y == 0) {
                player.velocity.y -= 20
            }
            // keys.up.pressed = true 
            break;
    }
})

addEventListener('keyup', ({ keyCode }) => {
    switch ( keyCode ) {
        case 65:
            keys.left.pressed = false 
            break;
        case 83:
            // keys.down.pressed = false 
            break;
        case 68:
            keys.right.pressed = false 
            break;
        case 87:
            // keys.up.pressed = false 
            break;
    }
})