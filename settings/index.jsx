function settingsComponent(props) {
    return (
        <Page>
            <Section title={<Text bold align="center">App Settings</Text>}/>
            <Select
                title="My List"
                label={`Selection`}
                settingsKey="testKey"
                options={[
                    {name:"foo", value:"hello"},
                    {name:"bar", value:"world"},
                ]}
                renderItem={
                    (option) =>
                    <TextImageRow
                        label={option.name}
                        sublabel={option.addr}
                    />
                }
            />
        </Page>
    );
}

registerSettingsPage(settingsComponent);
