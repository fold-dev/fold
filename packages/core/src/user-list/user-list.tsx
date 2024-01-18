import React, { Fragment, ReactElement, useMemo } from 'react'
import { Avatar, Card, Divider, Heading, Text, View } from '../'
import { classNames } from '../helpers'
import { CoreViewProps, Size } from '../types'

export type UserListUser = {
    image: string
    name: string
    description?: string
    tools?: ReactElement[] | ReactElement
}

export type UserListProps = {
    padding?: number | string
    width?: number | string
    users: UserListUser[]
} & CoreViewProps

export const UserList = (props: UserListProps) => {
    const { width = '100%', padding = 10, users = [], ...rest } = props
    const className = classNames(
        {
            'f-user-list': true,
        },
        [props.className]
    )

    return (
        <Card
            {...rest}
            width={width}
            className={className}>
            {users.map((user: UserListUser, index: number) => (
                <Fragment key={index}>
                    {index != 0 && <Divider />}
                    <View
                        row
                        justifyContent="flex-start"
                        p={padding}
                        className="f-user-list__row">
                        <Avatar
                            src={user.image}
                            name={user.name}
                        />
                        <View
                            column
                            alignItems="flex-start"
                            flex={1}>
                            <Heading
                                as="h5"
                                className="f-user-list-name">
                                {user.name}
                            </Heading>
                            {user.description && (
                                <Text
                                    size="sm"
                                    className="f-user-list-description">
                                    {user.description}
                                </Text>
                            )}
                        </View>
                        {user.tools && (
                            <View
                                row
                                className="f-user-list__tools">
                                {user.tools}
                            </View>
                        )}
                    </View>
                </Fragment>
            ))}
        </Card>
    )
}
