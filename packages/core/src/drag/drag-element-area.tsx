import React, {
    Children,
    forwardRef,
    useEffect,
    useLayoutEffect,
    useMemo,
    useRef
} from 'react'
import {
    classNames,
    CoreViewProps,
    documentObject,
    DragVariant,
    getDragState,
    mergeRefs,
    useDragEvent,
    useId,
    useWindowEvent,
    View
} from '../'

export type DragElementAreaProps = {
    indent?: boolean
    areaId?: string
    group?: string
    variant?: DragVariant
    targetVariant?: any
    direction?: 'vertical'
    startDelay?: number
    footer?: any
    /**
     * This value needs to be the same as `--f-drag-lined-size` 
     */
    linedVariantPlaceholderSize?: number
} & CoreViewProps

export const DragElementArea = forwardRef((props: DragElementAreaProps, ref) => {
    const {
        areaId,
        group = 'default',
        variant = 'animated',
        targetVariant = {},
        direction = 'vertical',
        startDelay = 100,
        linedVariantPlaceholderSize = 3,
        footer,
        ...rest
    } = props
    const { origin } = getDragState('origin')
    const { target } = getDragState('target')
    const containerRef = useRef(null)
    const bufferRef = useRef(null)
    const id = useId(areaId)
    const noChildren = useMemo(() => Children.count(props.children) == 0, [props.children])
    const { 
        isHorizontal, 
        isVertical, 
        isDragging, 
        hasOriginVariant, 
        finalTargetVariant, 
        placeholder,
        isLinedFocus,
        isLined,
        isFocus,
        isAnimated, 
    } = useMemo(() => {
        // variant is when the origin's DragArea specifies a variant
        // via "targetVariant" that affects this DragArea
        // finalTargetVariant = make sure to add THIS group's variant
        const finalTargetVariant = JSON.stringify({ ...targetVariant, [group]: variant })
        const originVariant: DragVariant = origin.targetVariant[group]
        const hasOriginVariant = !!originVariant
        const isLined = originVariant == 'lined'
        const isLinedFocus = originVariant == 'lined-focus'
        const isFocus = originVariant == 'focus'
        const isAnimated = originVariant == 'animated'
        const isHorizontal = direction != 'vertical'
        const isVertical = direction == 'vertical'
        const isTargetFocus = target.focus
        const isTargetArea = id == target.areaId
        const isDragging = !!origin.areaId

        // moves to where the cursor is
        const placeholder: any = {
            visible: (isAnimated || isLined || isLinedFocus) && isTargetArea && !isTargetFocus,
            className: isAnimated ? 'f-drag-area__placeholder' : 'f-drag-area__placeholder-lined',
            marginLeft: target.indent ? `calc(var(--f-drag-indent) * ${target.indent})` : 0,
            width: target.indent ? `calc(100% - var(--f-drag-indent) * ${target.indent})` : '100%',
            // this needs to be considered at some point:
            // width: isVertical ? target.width || origin.width : origin.width,
            position: noChildren ? 'relative' : 'absolute',
            height: isVertical ? (isLined || isLinedFocus ? undefined : origin.height) : target.height || origin.height,
            transform: noChildren
                ? null
                : isVertical
                ? `translateY(${
                      target.moveDirection == 'down'
                          ? target.top + target.height
                          : target.moveDirection == 'up'
                          ? target.top
                          : 0
                  }px)`
                : `translateX(${
                      target.moveDirection == 'right'
                          ? target.left + target.width
                          : target.moveDirection == 'left'
                          ? target.left
                          : 0
                  }px)`,
        }

        return {
            isHorizontal,
            isVertical,
            isDragging,
            hasOriginVariant,
            finalTargetVariant,
            placeholder,
            isLinedFocus,
            isLined,
            isFocus,
            isAnimated,
        }
    }, [id, origin, target, direction, targetVariant, variant])
    const className = classNames(
        {
            'f-drag-area': true,
            'f-row': isHorizontal,
            'f-col': isVertical,
            'is-dragging': isDragging,
            'is-horizontal': isHorizontal,
            'is-vertical': isVertical,
            'no-origin-variant': !hasOriginVariant,
        },
        [props.className]
    )

    const handleMouseUp = (e) => {
        delete documentObject.body.dataset.dragginganimation
    }

    const handleDragStart = (e) => {
        setTimeout(() => documentObject.body.dataset.dragginganimation = 'yes', startDelay)
    }

    const handleDragEnd = (e) => {
        delete documentObject.body.dataset.dragginganimation
    }

    useDragEvent('onstart', handleDragStart)
    useDragEvent('onend', handleDragEnd)
    useWindowEvent('mouseup', handleMouseUp)

    // --------------------------------------------------------------------------
    // manage buffer element & element transforms (reacting to the target index)
    // --------------------------------------------------------------------------

    useEffect(() => {
        let bufferHasBeenMadeVisible = false
        const isTargetArea = id == target.areaId
        const originVariant: DragVariant = origin.targetVariant[group]
        const isAnimated = originVariant == 'animated'

        containerRef.current.childNodes.forEach((node, index) => {
            // if its a dragelement & the right area
            // previously >>> && node.dataset.areaid == id
            if (node.dataset.dragelement) { 
                const isDragged = origin.index == index && origin.areaId == id

                // elementShouldFocus
                // if the target has focus (isFocus/isLinedFocus)
                // then highlight the DOM element by adding a data attr
                if (target.focus && isTargetArea && index == target.index) {
                    node.dataset.focus = 'yes'
                } else {
                    delete node.dataset.focus
                }

                // respect the inline display setting (task hierarchies)
                // if a user adds "display: flex" or "display: none" to the drag element,
                // then default back to that initial display property
                node.style.display = isAnimated && isDragged ? 'none' : node.dataset.fallbackdisplay || 'flex'

                // bufferShouldBeVisible
                // we do this here so that they are done at the same time
                // to avoid any glitches behaviour
                // previously >>> && isDragged
                if (isAnimated && isTargetArea) { 
                    bufferRef.current.style.display = 'block'
                    bufferRef.current.style.width = isVertical ? '100%' : origin.width + 'px'
                    bufferRef.current.style.height = isVertical ? origin.height + 'px' : '100%'
                    bufferHasBeenMadeVisible = true
                }

                // animate the node up or down
                // this is main drag animation (if it's isAnimated)
                // TODO: implement horizontal
                node.style.transform = isAnimated
                    ? isTargetArea && index >= target.index
                        ? direction == 'vertical'
                            ? `translateY(${origin.height}px)`
                            : `translateX(${origin.width}px)`
                        : null
                    : null
            }
        })

        // if the buffer remains unaffected during transform
        // then hide it because it's probably in another area
        if (!bufferHasBeenMadeVisible) bufferRef.current.style.display = 'none'
    }, [props.children, id, origin, target])

    // ---------------------------------------------------------------------
    // generate indexes on each element after it renders & before it paints
    // ---------------------------------------------------------------------

    useLayoutEffect(() => {
        // always set this to off when the component mounts
        // or if children change
        bufferRef.current.style.display = 'none'

        // wait for the dom to render the children first
        // 150ms is good estimate - might need to be adjusted
        // TODO: actually rework this
        setTimeout(() => {
            // we manually add the attr. for perfornace
            // instead of calculating each iteration (above)
            containerRef.current.childNodes.forEach((node, index) => {
                // only if its a dragelement - ignore buffer elements
                if (node.dataset.dragelement) {
                    node.dataset.index = index
                    node.dataset.areaid = id
                }
            })
        }, 150)
    }, [props.children, id, origin])

    return (
        <View
            {...rest}
            id={id}
            ref={mergeRefs([ref, containerRef])}
            className={className}
            data-areaid={id}
            data-dragarea={true}
            data-group={group}
            data-direction={direction}
            data-targetvariant={finalTargetVariant}>
            {props.children}
            
            {placeholder.visible && (
                <div
                    className={placeholder.className}
                    data-placeholder={true}
                    style={{
                        transform: placeholder.transform,
                        marginLeft: placeholder.marginLeft,
                        position: placeholder.position,
                        width: placeholder.width,
                        height: placeholder.height,
                    }}
                />
            )}

            <div
                ref={bufferRef}
                data-buffer={true}
                className="f-drag-area__buffer"
            />

            {footer}
        </View>
    )
})
