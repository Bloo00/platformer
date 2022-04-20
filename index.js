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
    constructor() {
        this.position = {
            x: 0,
            y: 0
        }

        this.width = 200
        this.height = 20
    }

    draw() {
        c.fillStyle= 'blue'
        c.fillRect(this.position.x, this.position.y, this.width, this.height)
    }
}


const player = new Player()
const platform = new Platform()


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
    player.update()
    // for left and right
    if (keys.right.pressed) {
        player.velocity.x       = 5
    }else if (keys.left.pressed) {
        player.velocity.x       = -5
    }else player.velocity.x     = 0

}

animate()

// ============================================================================= event listeners


// todo gotta make a jump thingy
addEventListener('keydown', ({ keyCode }) => {
    switch ( keyCode ) {
        case 65:
            keys.left.pressed = true 
            break;
        case 83:
            keys.down.pressed = true 
            break;
        case 68:
            keys.right.pressed = true 
            break;
        case 87:

            keys.up.pressed = true 
            break;
    }
})

addEventListener('keyup', ({ keyCode }) => {
    switch ( keyCode ) {
        case 65:
            keys.left.pressed = false 
            break;
        case 83:
            keys.down.pressed = false 
            break;
        case 68:
            keys.right.pressed = false 
            break;
        case 87:
            keys.up.pressed = false 
            break;
    }
})